import SongCard from "../components/SongCard";
import { useAuth } from "../context/AuthContext";

const LikedSongs = () => {
  const { user } = useAuth();

  const favouriteSongs = user?.favourites || [];

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest text-green-500 font-semibold">
          Playlist
        </p>

        <h1 className="text-4xl sm:text-5xl font-black mt-2">
          ❤️ Liked Songs
        </h1>

        <p className="text-zinc-400 mt-3">
          {favouriteSongs.length}{" "}
          {favouriteSongs.length === 1 ? "song" : "songs"}
        </p>
      </div>

      {favouriteSongs.length === 0 ? (
        <div className="flex items-center justify-center h-64 rounded-xl border border-zinc-800 bg-zinc-950">
          <p className="text-zinc-500 text-lg">
            You haven't liked any songs yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {favouriteSongs.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              songs={favouriteSongs}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedSongs;