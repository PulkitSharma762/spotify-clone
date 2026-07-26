import { useEffect, useState } from "react";
import {
  FaPause,
  FaPlay,
} from "react-icons/fa";

import AlbumCard from "../components/AlbumCard";
import SongCard from "../components/SongCard";

import {
  getAlbums,
  getAllSongs,
} from "../api/musicApi";

import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    setQueue,
  } = usePlayer();

  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadMusic = async () => {
      try {
        setLoading(true);
        setError("");

        const [albumsResponse, songsResponse] =
          await Promise.all([
            getAlbums(),
            getAllSongs(),
          ]);

        if (ignore) return;

        const loadedAlbums =
          albumsResponse.data.albums || [];

        const loadedSongs =
          songsResponse.data.musics || [];

        setAlbums(loadedAlbums);
        setSongs(loadedSongs);
        setQueue(loadedSongs);
      } catch (error) {
        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Unable to load music"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadMusic();

    return () => {
      ignore = true;
    };
  }, [setQueue]);

  const playFeaturedSong = (song) => {
    if (currentSong?._id === song._id) {
      togglePlay();
      return;
    }

    playSong(song, songs);
  };

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div>
          <div className="h-4 w-28 bg-zinc-800 rounded mb-3" />
          <div className="h-10 w-56 bg-zinc-800 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-18 bg-zinc-800 rounded-md"
              />
            )
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map(
            (_, index) => (
              <div key={index}>
                <div className="aspect-square bg-zinc-800 rounded-lg" />
                <div className="h-4 bg-zinc-800 rounded mt-4 w-3/4" />
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-80 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-zinc-800 flex items-center justify-center text-xl">
            !
          </div>

          <h2 className="text-2xl font-bold mt-5">
            Couldn't load your music
          </h2>

          <p className="text-zinc-400 mt-2">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <section>
        <p className="text-zinc-400 text-sm font-medium mb-1">
          Welcome back
        </p>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          {user?.username || "Listener"}
        </h1>

        {songs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-7">
            {songs.slice(0, 6).map((song) => {
              const isCurrent =
                currentSong?._id === song._id;

              const initial =
                song.title
                  ?.trim()
                  ?.charAt(0)
                  ?.toUpperCase() || "♪";

              return (
                <button
                  type="button"
                  key={song._id}
                  onClick={() =>
                    playFeaturedSong(song)
                  }
                  className={`group h-18 flex items-center rounded-md overflow-hidden transition text-left ${
                    isCurrent
                      ? "bg-white/15"
                      : "bg-white/8 hover:bg-white/15"
                  }`}
                >
                  <div className="relative w-18 h-18 shrink-0 bg-linear-to-br from-green-600 via-green-950 to-black flex items-center justify-center overflow-hidden shadow-lg">
                    {song.coverImage ? (
                      <img
                        src={song.coverImage}
                        alt={`${song.title} cover`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-black text-white/90">
                        {initial}
                      </span>
                    )}
                  </div>

                  <span
                    className={`font-bold truncate px-4 flex-1 ${
                      isCurrent
                        ? "text-green-400"
                        : "text-white"
                    }`}
                  >
                    {song.title}
                  </span>

                  <span className="w-10 h-10 mr-3 shrink-0 rounded-full bg-green-500 text-black items-center justify-center shadow-xl hidden group-hover:flex">
                    {isCurrent && isPlaying ? (
                      <FaPause />
                    ) : (
                      <FaPlay className="ml-0.5" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-7 rounded-lg border border-white/5 bg-white/5 px-6 py-8">
            <h2 className="font-bold">
              No songs yet
            </h2>

            <p className="text-sm text-zinc-400 mt-1">
              Uploaded songs will appear here.
            </p>
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Your collection
          </h2>

          {albums.length > 0 && (
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              {albums.length}{" "}
              {albums.length === 1
                ? "collection"
                : "collections"}
            </span>
          )}
        </div>

        {albums.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1">
            {albums.map((album) => (
              <AlbumCard
                key={album._id}
                album={album}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-white/5 bg-white/5 px-6 py-8 text-zinc-400">
            No collections have been created yet.
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-3">
          All songs
        </h2>

        {songs.length > 0 ? (
          <div className="max-w-5xl">
            {songs.map((song) => (
              <SongCard
                key={song._id}
                song={song}
                songs={songs}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-white/5 bg-white/5 px-6 py-8 text-zinc-400">
            No songs have been uploaded yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;