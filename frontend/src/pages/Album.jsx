import { useEffect, useState } from "react";
import {
  FaPause,
  FaPlay,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

import { getAlbum } from "../api/musicApi";
import { usePlayer } from "../context/PlayerContext";

const Album = () => {
  const { id } = useParams();

  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    setQueue,
  } = usePlayer();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadAlbum = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAlbum(id);

        if (ignore) return;

        const loadedAlbum = response.data.album;

        setAlbum(loadedAlbum);
        setQueue(loadedAlbum.musics || []);
      } catch (error) {
        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Unable to load collection"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadAlbum();

    return () => {
      ignore = true;
    };
  }, [id, setQueue]);

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-700 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="min-h-96 flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold">
            Collection unavailable
          </h1>

          <p className="text-zinc-400 mt-2">
            {error || "Collection not found"}
          </p>
        </div>
      </div>
    );
  }

  const songs = album.musics || [];

  const albumArtist =
    album.artist?.username || "Various Artists";

  const initial =
    album.title
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "A";

  const albumIsPlaying =
    isPlaying &&
    songs.some(
      (song) => song._id === currentSong?._id
    );

  const handleMainPlay = () => {
    if (!songs.length) return;

    const belongsToAlbum = songs.some(
      (song) => song._id === currentSong?._id
    );

    if (belongsToAlbum) {
      togglePlay();
    } else {
      playSong(songs[0], songs);
    }
  };

  return (
    <div className="-mx-4 sm:-mx-6 -mt-5 sm:-mt-6 pb-10">
      <section className="relative overflow-hidden bg-linear-to-b from-green-900 via-green-950 to-zinc-900 px-5 sm:px-8 pt-10 pb-8">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-end gap-6">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-56 lg:h-56 shrink-0 shadow-2xl rounded-md overflow-hidden bg-linear-to-br from-green-500 via-green-900 to-black">
            {album.coverImage ? (
              <img
                src={album.coverImage}
                alt={`${album.title} cover`}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-green-300/15 blur-2xl" />

                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-7xl sm:text-8xl font-black text-white/90 drop-shadow-2xl">
                    {initial}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="min-w-0 pb-1">
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">
              Collection
            </p>

            <h1 className="text-4xl md:text-5xl xl:text-7xl font-black tracking-tight mt-2 wrap-break-word">
              {album.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-5 text-sm text-zinc-200">
              <span className="font-bold text-white">
                {albumArtist}
              </span>

              <span>•</span>

              <span>
                {songs.length}{" "}
                {songs.length === 1
                  ? "song"
                  : "songs"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-green-950/35 via-zinc-950 to-black px-4 sm:px-8 pt-6 min-h-80">
        <button
          type="button"
          onClick={handleMainPlay}
          disabled={!songs.length}
          aria-label={
            albumIsPlaying
              ? "Pause collection"
              : "Play collection"
          }
          className="w-14 h-14 bg-green-500 hover:bg-green-400 disabled:opacity-40 text-black rounded-full flex items-center justify-center text-xl shadow-xl transition hover:scale-105"
        >
          {albumIsPlaying ? (
            <FaPause />
          ) : (
            <FaPlay className="ml-1" />
          )}
        </button>

        {songs.length > 0 ? (
          <div className="mt-7">
            <div className="grid grid-cols-[36px_minmax(0,1fr)_minmax(90px,0.6fr)] items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider text-zinc-500 border-b border-white/10">
              <span>#</span>
              <span>Title</span>
              <span>Artist</span>
            </div>

            <div className="mt-2">
              {songs.map((song, index) => {
                const isCurrent =
                  currentSong?._id === song._id;

                const songInitial =
                  song.title
                    ?.trim()
                    ?.charAt(0)
                    ?.toUpperCase() || "♪";

                return (
                  <button
                    type="button"
                    key={song._id}
                    onClick={() => {
                      if (isCurrent) {
                        togglePlay();
                      } else {
                        playSong(song, songs);
                      }
                    }}
                    className="group w-full grid grid-cols-[36px_minmax(0,1fr)_minmax(90px,0.6fr)] items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-white/10 transition"
                  >
                    <span
                      className={`text-sm ${
                        isCurrent
                          ? "text-green-500"
                          : "text-zinc-400 group-hover:text-white"
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <FaPause />
                      ) : (
                        index + 1
                      )}
                    </span>

                    <div className="flex items-center gap-3 min-w-0">
                      <div className="hidden sm:flex w-10 h-10 shrink-0 rounded bg-linear-to-br from-green-700 via-green-950 to-black items-center justify-center overflow-hidden shadow">
                        {song.coverImage ? (
                          <img
                            src={song.coverImage}
                            alt={`${song.title} cover`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-black text-white/80">
                            {songInitial}
                          </span>
                        )}
                      </div>

                      <span
                        className={`font-medium truncate ${
                          isCurrent
                            ? "text-green-500"
                            : "text-white"
                        }`}
                      >
                        {song.title}
                      </span>
                    </div>

                    <span className="text-sm text-zinc-400 truncate">
                      {song.artist ||
                        "Unknown artist"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-white/5 bg-white/5 px-6 py-8">
            <h2 className="font-bold">
              This collection is empty
            </h2>

            <p className="text-sm text-zinc-400 mt-1">
              Add songs to see them here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Album;