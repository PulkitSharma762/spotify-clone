import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AlbumCard = ({ album }) => {
  const navigate = useNavigate();

  const artistName =
    album?.artist?.username || "Various Artists";

  const initial =
    album?.title?.trim()?.charAt(0)?.toUpperCase() ||
    "A";

  const openAlbum = () => {
    navigate(`/album/${album._id}`);
  };

  return (
    <article
      onClick={openAlbum}
      className="group min-w-0 rounded-lg p-3 hover:bg-white/5 cursor-pointer transition duration-300"
    >
      <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl bg-linear-to-br from-green-600 via-green-950 to-black">
        {album.coverImage ? (
          <img
            src={album.coverImage}
            alt={`${album.title} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-green-400/15 rounded-full blur-2xl" />

            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-black/50 rounded-full blur-2xl" />

            <div className="relative w-full h-full flex items-center justify-center">
              <span className="text-6xl sm:text-7xl font-black text-white/90 drop-shadow-2xl">
                {initial}
              </span>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            openAlbum();
          }}
          aria-label={`Open ${album.title}`}
          className="absolute right-3 bottom-3 w-12 h-12 rounded-full bg-green-500 hover:bg-green-400 text-black flex items-center justify-center shadow-xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 hover:scale-105"
        >
          <FaPlay className="ml-1" />
        </button>
      </div>

      <h2 className="font-bold truncate mt-4">
        {album.title}
      </h2>

      <p className="text-zinc-400 text-sm mt-1 truncate">
        {artistName}
      </p>
    </article>
  );
};

export default AlbumCard;