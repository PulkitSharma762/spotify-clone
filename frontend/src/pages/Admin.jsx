import { useEffect, useMemo, useState } from "react";
import {
  FaCheck,
  FaCloudUploadAlt,
  FaCompactDisc,
  FaImage,
  FaMusic,
  FaPlus,
} from "react-icons/fa";

import {
  createAlbum,
  getAllSongs,
  uploadSong,
} from "../api/musicApi";

const getErrorMessage = (error, fallback) => {
  return error?.response?.data?.message || fallback;
};

const Admin = () => {
  const [songs, setSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(true);

  const [songForm, setSongForm] = useState({
    title: "",
    artist: "",
  });

  const [audioFile, setAudioFile] = useState(null);
  const [songCover, setSongCover] = useState(null);

  const [songUploading, setSongUploading] =
    useState(false);

  const [songMessage, setSongMessage] = useState({
    type: "",
    text: "",
  });

  const [albumTitle, setAlbumTitle] = useState("");
  const [albumCover, setAlbumCover] = useState(null);
  const [selectedSongs, setSelectedSongs] = useState([]);

  const [albumCreating, setAlbumCreating] =
    useState(false);

  const [albumMessage, setAlbumMessage] = useState({
    type: "",
    text: "",
  });

  const loadSongs = async () => {
    try {
      setSongsLoading(true);

      const response = await getAllSongs();

      setSongs(response.data.musics || []);
    } catch (error) {
      console.error("Failed to load songs:", error);
    } finally {
      setSongsLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const songCoverPreview = useMemo(() => {
    if (!songCover) {
      return "";
    }

    return URL.createObjectURL(songCover);
  }, [songCover]);

  const albumCoverPreview = useMemo(() => {
    if (!albumCover) {
      return "";
    }

    return URL.createObjectURL(albumCover);
  }, [albumCover]);

  useEffect(() => {
    return () => {
      if (songCoverPreview) {
        URL.revokeObjectURL(songCoverPreview);
      }
    };
  }, [songCoverPreview]);

  useEffect(() => {
    return () => {
      if (albumCoverPreview) {
        URL.revokeObjectURL(albumCoverPreview);
      }
    };
  }, [albumCoverPreview]);

  const handleSongInputChange = (event) => {
    const { name, value } = event.target;

    setSongForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSongUpload = async (event) => {
    event.preventDefault();

    setSongMessage({
      type: "",
      text: "",
    });

    const title = songForm.title.trim();
    const artist = songForm.artist.trim();

    if (!title || !artist || !audioFile) {
      setSongMessage({
        type: "error",
        text: "Title, artist and audio file are required.",
      });

      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("music", audioFile);

    if (songCover) {
      formData.append("coverImage", songCover);
    }

    try {
      setSongUploading(true);

      await uploadSong(formData);

      setSongMessage({
        type: "success",
        text: "Song uploaded successfully.",
      });

      setSongForm({
        title: "",
        artist: "",
      });

      setAudioFile(null);
      setSongCover(null);

      const audioInput =
        document.getElementById("song-audio");

      const coverInput =
        document.getElementById("song-cover");

      if (audioInput) {
        audioInput.value = "";
      }

      if (coverInput) {
        coverInput.value = "";
      }

      await loadSongs();
    } catch (error) {
      setSongMessage({
        type: "error",
        text: getErrorMessage(
          error,
          "Could not upload the song."
        ),
      });
    } finally {
      setSongUploading(false);
    }
  };

  const toggleSong = (songId) => {
    setSelectedSongs((current) => {
      if (current.includes(songId)) {
        return current.filter((id) => id !== songId);
      }

      return [...current, songId];
    });
  };

  const handleAlbumCreate = async (event) => {
    event.preventDefault();

    setAlbumMessage({
      type: "",
      text: "",
    });

    const title = albumTitle.trim();

    if (!title) {
      setAlbumMessage({
        type: "error",
        text: "Album title is required.",
      });

      return;
    }

    if (selectedSongs.length === 0) {
      setAlbumMessage({
        type: "error",
        text: "Select at least one song.",
      });

      return;
    }

    const formData = new FormData();

    formData.append("title", title);

    formData.append(
      "musics",
      JSON.stringify(selectedSongs)
    );

    if (albumCover) {
      formData.append("coverImage", albumCover);
    }

    try {
      setAlbumCreating(true);

      await createAlbum(formData);

      setAlbumMessage({
        type: "success",
        text: "Album created successfully.",
      });

      setAlbumTitle("");
      setAlbumCover(null);
      setSelectedSongs([]);

      const coverInput =
        document.getElementById("album-cover");

      if (coverInput) {
        coverInput.value = "";
      }
    } catch (error) {
      setAlbumMessage({
        type: "error",
        text: getErrorMessage(
          error,
          "Could not create the album."
        ),
      });
    } finally {
      setAlbumCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <p className="text-green-500 font-bold text-sm uppercase tracking-widest">
          Artist tools
        </p>

        <h1 className="text-3xl sm:text-4xl font-black mt-2">
          Content Manager
        </h1>

        <p className="text-zinc-400 mt-2 max-w-2xl">
          Upload music and artwork or create collections
          using songs already in your library.
        </p>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <section className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-full bg-green-500 text-black flex items-center justify-center">
              <FaCloudUploadAlt className="text-xl" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Upload song
              </h2>

              <p className="text-sm text-zinc-500">
                Add a new track to your library
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSongUpload}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="song-title"
                className="block text-sm font-semibold mb-2"
              >
                Song title
              </label>

              <input
                id="song-title"
                name="title"
                type="text"
                maxLength={100}
                value={songForm.title}
                onChange={handleSongInputChange}
                placeholder="Enter song title"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-green-500 outline-none rounded-lg px-4 py-3 transition"
              />
            </div>

            <div>
              <label
                htmlFor="song-artist"
                className="block text-sm font-semibold mb-2"
              >
                Artist
              </label>

              <input
                id="song-artist"
                name="artist"
                type="text"
                maxLength={100}
                value={songForm.artist}
                onChange={handleSongInputChange}
                placeholder="Enter artist name"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-green-500 outline-none rounded-lg px-4 py-3 transition"
              />
            </div>

            <div>
              <label
                htmlFor="song-audio"
                className="block text-sm font-semibold mb-2"
              >
                Audio file
              </label>

              <label
                htmlFor="song-audio"
                className="flex items-center gap-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl p-4 cursor-pointer transition"
              >
                <div className="w-11 h-11 rounded-lg bg-black flex items-center justify-center text-green-500 shrink-0">
                  <FaMusic />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold truncate">
                    {audioFile
                      ? audioFile.name
                      : "Choose audio file"}
                  </p>

                  <p className="text-xs text-zinc-500 mt-1">
                    MP3 or another supported audio format
                  </p>
                </div>
              </label>

              <input
                id="song-audio"
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(event) =>
                  setAudioFile(
                    event.target.files?.[0] || null
                  )
                }
              />
            </div>

            <div>
              <label
                htmlFor="song-cover"
                className="block text-sm font-semibold mb-2"
              >
                Cover image
                <span className="text-zinc-500 font-normal">
                  {" "}
                  (optional)
                </span>
              </label>

              <label
                htmlFor="song-cover"
                className="flex items-center gap-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl p-4 cursor-pointer transition"
              >
                {songCoverPreview ? (
                  <img
                    src={songCoverPreview}
                    alt="Song cover preview"
                    className="w-14 h-14 object-cover rounded-md shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-md bg-linear-to-br from-green-500 via-green-800 to-black flex items-center justify-center shrink-0">
                    <FaImage />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-semibold truncate">
                    {songCover
                      ? songCover.name
                      : "Choose cover image"}
                  </p>

                  <p className="text-xs text-zinc-500 mt-1">
                    JPG, PNG or WebP
                  </p>
                </div>
              </label>

              <input
                id="song-cover"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  setSongCover(
                    event.target.files?.[0] || null
                  )
                }
              />
            </div>

            {songMessage.text && (
              <div
                className={`rounded-lg px-4 py-3 text-sm ${
                  songMessage.type === "success"
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                {songMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={songUploading}
              className="w-full bg-green-500 hover:bg-green-400 disabled:bg-zinc-700 disabled:text-zinc-400 text-black font-bold rounded-full py-3.5 transition"
            >
              {songUploading
                ? "Uploading..."
                : "Upload Song"}
            </button>
          </form>
        </section>

        <section className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-full bg-green-500 text-black flex items-center justify-center">
              <FaCompactDisc className="text-xl" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Create collection
              </h2>

              <p className="text-sm text-zinc-500">
                Group existing songs together
              </p>
            </div>
          </div>

          <form
            onSubmit={handleAlbumCreate}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="album-title"
                className="block text-sm font-semibold mb-2"
              >
                Collection title
              </label>

              <input
                id="album-title"
                type="text"
                maxLength={100}
                value={albumTitle}
                onChange={(event) =>
                  setAlbumTitle(event.target.value)
                }
                placeholder="My Playlist"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-green-500 outline-none rounded-lg px-4 py-3 transition"
              />
            </div>

            <div>
              <label
                htmlFor="album-cover"
                className="block text-sm font-semibold mb-2"
              >
                Cover image
                <span className="text-zinc-500 font-normal">
                  {" "}
                  (optional)
                </span>
              </label>

              <label
                htmlFor="album-cover"
                className="flex items-center gap-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl p-4 cursor-pointer transition"
              >
                {albumCoverPreview ? (
                  <img
                    src={albumCoverPreview}
                    alt="Collection cover preview"
                    className="w-14 h-14 object-cover rounded-md shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-md bg-linear-to-br from-green-500 via-green-800 to-black flex items-center justify-center shrink-0">
                    <FaImage />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-semibold truncate">
                    {albumCover
                      ? albumCover.name
                      : "Choose collection cover"}
                  </p>

                  <p className="text-xs text-zinc-500 mt-1">
                    JPG, PNG or WebP
                  </p>
                </div>
              </label>

              <input
                id="album-cover"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  setAlbumCover(
                    event.target.files?.[0] || null
                  )
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold">
                  Select songs
                </label>

                <span className="text-xs text-zinc-500">
                  {selectedSongs.length} selected
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {songsLoading ? (
                  <div className="text-zinc-500 text-sm py-8 text-center">
                    Loading songs...
                  </div>
                ) : songs.length === 0 ? (
                  <div className="border border-dashed border-zinc-700 rounded-xl p-6 text-center">
                    <FaMusic className="mx-auto text-zinc-600 text-2xl" />

                    <p className="text-zinc-400 mt-3 text-sm">
                      Upload a song first.
                    </p>
                  </div>
                ) : (
                  songs.map((song) => {
                    const selected =
                      selectedSongs.includes(song._id);

                    return (
                      <button
                        key={song._id}
                        type="button"
                        onClick={() =>
                          toggleSong(song._id)
                        }
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition ${
                          selected
                            ? "bg-green-500/10 border-green-500/50"
                            : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                        }`}
                      >
                        {song.coverImage ? (
                          <img
                            src={song.coverImage}
                            alt=""
                            className="w-11 h-11 object-cover rounded shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded bg-linear-to-br from-green-500 via-green-800 to-black flex items-center justify-center font-bold shrink-0">
                            {song.title
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm truncate">
                            {song.title}
                          </p>

                          <p className="text-xs text-zinc-500 truncate mt-0.5">
                            {song.artist}
                          </p>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                            selected
                              ? "bg-green-500 border-green-500 text-black"
                              : "border-zinc-600"
                          }`}
                        >
                          {selected && (
                            <FaCheck className="text-xs" />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {albumMessage.text && (
              <div
                className={`rounded-lg px-4 py-3 text-sm ${
                  albumMessage.type === "success"
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                {albumMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={albumCreating || songs.length === 0}
              className="w-full bg-white hover:scale-[1.01] disabled:bg-zinc-700 disabled:text-zinc-400 disabled:hover:scale-100 text-black font-bold rounded-full py-3.5 transition"
            >
              <span className="flex items-center justify-center gap-2">
                <FaPlus />

                {albumCreating
                  ? "Creating..."
                  : "Create Collection"}
              </span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Admin;