import { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

import { getAlbums, getAllSongs } from "../api/musicApi";
import AlbumCard from "../components/AlbumCard";
import SongCard from "../components/SongCard";
import { usePlayer } from "../context/PlayerContext";

const Search = () => {
  const { setQueue } = usePlayer();

  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const [songsResponse, albumsResponse] =
          await Promise.all([
            getAllSongs(),
            getAlbums(),
          ]);

        if (ignore) return;

        const loadedSongs =
          songsResponse.data.musics || [];

        setSongs(loadedSongs);
        setAlbums(albumsResponse.data.albums || []);
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

    loadData();

    return () => {
      ignore = true;
    };
  }, [setQueue]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSongs = useMemo(() => {
    if (!normalizedQuery) return [];

    return songs.filter((song) => {
      return (
        song.title
          ?.toLowerCase()
          .includes(normalizedQuery) ||
        song.artist
          ?.toLowerCase()
          .includes(normalizedQuery)
      );
    });
  }, [songs, normalizedQuery]);

  const filteredAlbums = useMemo(() => {
    if (!normalizedQuery) return [];

    return albums.filter((album) => {
      return (
        album.title
          ?.toLowerCase()
          .includes(normalizedQuery) ||
        album.artist?.username
          ?.toLowerCase()
          .includes(normalizedQuery)
      );
    });
  }, [albums, normalizedQuery]);

  if (loading) {
    return (
      <div className="min-h-80 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-700 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-80 flex items-center justify-center text-zinc-400">
        {error}
      </div>
    );
  }

  const hasResults =
    filteredSongs.length > 0 ||
    filteredAlbums.length > 0;

  return (
    <div className="pb-10">
      <div className="relative max-w-xl mb-10">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

        <input
          type="search"
          autoFocus
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="What do you want to play?"
          className="w-full bg-zinc-800 hover:bg-zinc-700 focus:bg-zinc-700 border border-transparent focus:border-zinc-500 rounded-full py-3.5 pl-12 pr-5 text-white placeholder:text-zinc-400 outline-none transition"
        />
      </div>

      {!normalizedQuery ? (
        <section>
          <h1 className="text-3xl font-bold mb-6">
            Search
          </h1>

          <div className="rounded-xl bg-linear-to-br from-green-700 to-green-950 min-h-48 p-7 flex items-end">
            <div>
              <p className="text-sm text-green-100 mb-2">
                Your music library
              </p>

              <h2 className="text-3xl sm:text-4xl font-black">
                Find your next song
              </h2>

              <p className="text-green-100/80 mt-3">
                Search by song, artist, or album.
              </p>
            </div>
          </div>
        </section>
      ) : !hasResults ? (
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold">
            No results found
          </h2>

          <p className="text-zinc-400 mt-2">
            Try searching for another song, artist,
            or album.
          </p>
        </div>
      ) : (
        <>
          {filteredSongs.length > 0 && (
            <section>
              <h1 className="text-2xl font-bold mb-5">
                Songs
              </h1>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                {filteredSongs.map((song) => (
                  <SongCard
                    key={song._id}
                    song={song}
                    songs={filteredSongs}
                  />
                ))}
              </div>
            </section>
          )}

          {filteredAlbums.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-bold mb-5">
                Albums
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredAlbums.map((album) => (
                  <AlbumCard
                    key={album._id}
                    album={album}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Search;