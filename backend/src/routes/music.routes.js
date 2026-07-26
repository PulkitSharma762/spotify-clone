const express = require("express");
const multer = require("multer");

const musicController = require("../controllers/music.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.fieldname === "music") {
      if (!file.mimetype.startsWith("audio/")) {
        const error = new Error("Only audio files are allowed for music");
        error.status = 400;
        return cb(error);
      }

      return cb(null, true);
    }

    if (file.fieldname === "coverImage") {
      if (!file.mimetype.startsWith("image/")) {
        const error = new Error(
          "Only image files are allowed for cover images"
        );
        error.status = 400;
        return cb(error);
      }

      return cb(null, true);
    }

    const error = new Error("Unexpected file field");
    error.status = 400;

    return cb(error);
  },
});

router.post(
  "/upload",
  authMiddleware.authArtist,
  upload.fields([
    {
      name: "music",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  musicController.createMusic
);

router.post(
  "/album",
  authMiddleware.authArtist,
  upload.single("coverImage"),
  musicController.createAlbum
);

router.patch(
  "/:musicId/cover",
  authMiddleware.authArtist,
  upload.single("coverImage"),
  musicController.updateMusicCover
);

router.patch(
  "/albums/:albumId/cover",
  authMiddleware.authArtist,
  upload.single("coverImage"),
  musicController.updateAlbumCover
);

router.get(
  "/",
  authMiddleware.authUser,
  musicController.getAllMusics
);

router.get(
  "/albums",
  authMiddleware.authUser,
  musicController.getAllAlbums
);

router.get(
  "/albums/:albumId",
  authMiddleware.authUser,
  musicController.getAlbumById
);

module.exports = router;