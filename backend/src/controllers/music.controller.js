const mongoose = require("mongoose");

const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");

function createSafeFileName(originalName) {
  const safeOriginalName = originalName.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );

  return `${Date.now()}_${safeOriginalName}`;
}

async function createMusic(req, res, next) {
  try {
    const title = req.body.title?.trim();
    const artist = req.body.artist?.trim();

    const musicFile = req.files?.music?.[0];
    const coverFile = req.files?.coverImage?.[0];

    if (!title || !artist) {
      return res.status(400).json({
        message: "Song title and artist are required",
      });
    }

    if (title.length > 100 || artist.length > 100) {
      return res.status(400).json({
        message: "Title and artist cannot exceed 100 characters",
      });
    }

    if (!musicFile) {
      return res.status(400).json({
        message: "Audio file is required",
      });
    }

    const musicFileName = createSafeFileName(
      musicFile.originalname
    );

    const musicUpload = await uploadFile(
      musicFile.buffer,
      musicFileName,
      "SPOTIFY_CLONE/music"
    );

    let coverImage = "";

    if (coverFile) {
      const coverFileName = createSafeFileName(
        coverFile.originalname
      );

      const coverUpload = await uploadFile(
        coverFile.buffer,
        coverFileName,
        "SPOTIFY_CLONE/covers/songs"
      );

      coverImage = coverUpload.url;
    }

    const music = await musicModel.create({
      title,
      artist,
      uri: musicUpload.url,
      coverImage,
      uploadedBy: req.user.id,
    });

    await music.populate("uploadedBy", "username");

    return res.status(201).json({
      message: "Song uploaded successfully",
      music,
    });
  } catch (error) {
    next(error);
  }
}

async function createAlbum(req, res, next) {
  try {
    const title = req.body.title?.trim();

    let musics = req.body.musics;

    // When creating an album with form-data,
    // Postman sends the array as a JSON string.
    if (typeof musics === "string") {
      try {
        musics = JSON.parse(musics);
      } catch {
        return res.status(400).json({
          message: "Musics must be a valid JSON array of song IDs",
        });
      }
    }

    if (!title) {
      return res.status(400).json({
        message: "Album title is required",
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        message: "Album title cannot exceed 100 characters",
      });
    }

    if (!Array.isArray(musics) || musics.length === 0) {
      return res.status(400).json({
        message: "At least one song is required",
      });
    }

    const uniqueMusicIds = [...new Set(musics)];

    const hasInvalidId = uniqueMusicIds.some(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );

    if (hasInvalidId) {
      return res.status(400).json({
        message: "One or more song IDs are invalid",
      });
    }

    const existingMusics = await musicModel.find({
      _id: {
        $in: uniqueMusicIds,
      },
      uploadedBy: req.user.id,
    });

    if (existingMusics.length !== uniqueMusicIds.length) {
      return res.status(400).json({
        message:
          "One or more songs do not exist or were not uploaded by this account",
      });
    }

    let coverImage = "";

    if (req.file) {
      const coverFileName = createSafeFileName(
        req.file.originalname
      );

      const coverUpload = await uploadFile(
        req.file.buffer,
        coverFileName,
        "SPOTIFY_CLONE/covers/albums"
      );

      coverImage = coverUpload.url;
    }

    const album = await albumModel.create({
      title,
      artist: req.user.id,
      musics: uniqueMusicIds,
      coverImage,
    });

    await album.populate([
      {
        path: "artist",
        select: "username",
      },
      {
        path: "musics",
        populate: {
          path: "uploadedBy",
          select: "username",
        },
      },
    ]);

    return res.status(201).json({
      message: "Album created successfully",
      album,
    });
  } catch (error) {
    next(error);
  }
}

async function updateMusicCover(req, res, next) {
  try {
    const { musicId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(musicId)) {
      return res.status(400).json({
        message: "Invalid music ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Cover image is required",
      });
    }

    const music = await musicModel.findOne({
      _id: musicId,
      uploadedBy: req.user.id,
    });

    if (!music) {
      return res.status(404).json({
        message: "Song not found or you cannot edit this song",
      });
    }

    const coverFileName = createSafeFileName(
      req.file.originalname
    );

    const coverUpload = await uploadFile(
      req.file.buffer,
      coverFileName,
      "SPOTIFY_CLONE/covers/songs"
    );

    music.coverImage = coverUpload.url;

    await music.save();

    return res.status(200).json({
      message: "Song cover updated successfully",
      music,
    });
  } catch (error) {
    next(error);
  }
}

async function updateAlbumCover(req, res, next) {
  try {
    const { albumId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      return res.status(400).json({
        message: "Invalid album ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Cover image is required",
      });
    }

    const album = await albumModel.findOne({
      _id: albumId,
      artist: req.user.id,
    });

    if (!album) {
      return res.status(404).json({
        message: "Album not found or you cannot edit this album",
      });
    }

    const coverFileName = createSafeFileName(
      req.file.originalname
    );

    const coverUpload = await uploadFile(
      req.file.buffer,
      coverFileName,
      "SPOTIFY_CLONE/covers/albums"
    );

    album.coverImage = coverUpload.url;

    await album.save();

    return res.status(200).json({
      message: "Album cover updated successfully",
      album,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllMusics(req, res, next) {
  try {
    const musics = await musicModel
      .find()
      .populate("uploadedBy", "username")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      musics,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllAlbums(req, res, next) {
  try {
    const albums = await albumModel
      .find()
      .populate("artist", "username")
      .populate({
        path: "musics",
        select:
          "title artist uri coverImage duration uploadedBy",
        populate: {
          path: "uploadedBy",
          select: "username",
        },
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      albums,
    });
  } catch (error) {
    next(error);
  }
}

async function getAlbumById(req, res, next) {
  try {
    const { albumId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      return res.status(400).json({
        message: "Invalid album ID",
      });
    }

    const album = await albumModel
      .findById(albumId)
      .populate("artist", "username")
      .populate({
        path: "musics",
        select:
          "title artist uri coverImage duration uploadedBy",
        populate: {
          path: "uploadedBy",
          select: "username",
        },
      });

    if (!album) {
      return res.status(404).json({
        message: "Album not found",
      });
    }

    return res.status(200).json({
      album,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createMusic,
  createAlbum,
  updateMusicCover,
  updateAlbumCover,
  getAllMusics,
  getAllAlbums,
  getAlbumById,
};