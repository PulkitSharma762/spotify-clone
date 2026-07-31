import {
  FaPause,
  FaPlay,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";

const SongCard = ({ song, songs = [] }) => {
  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
  } = usePlayer();

  const {
    isFavourite,
    toggleFavouriteSong,
  } = useAuth();

  const isCurrentSong =
    currentSong?._id === song?._id;

  const initial =
    song?.title?.trim()?.charAt(0)?.toUpperCase() ||
    "♪";

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay();
      return;
    }

    playSong(song, songs);
  };

  const handleFavourite = (e) => {
    e.stopPropagation();
    toggleFavouriteSong(song);
  };

  return (
    <article
      onDoubleClick={handlePlay}
      className={`group flex items-center gap-3 p-2 rounded-md transition ${
        isCurrentSong
          ? "bg-white/10"
          : "hover:bg-white/10"
      }`}
    >
      <div className="relative w-13 h-13 sm:w-14 sm:h-14 shrink-0 rounded overflow-hidden bg-linear-to-br from-green-600 via-green-950 to-black shadow-md">
        {song.coverImage ? (
          <img
            src={song.coverImage}
            alt={`${song.title} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-black text-lg text-white/90">
              {initial}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handlePlay}
          aria-label={
            isCurrentSong && isPlaying
              ? `Pause ${song.title}`
              : `Play ${song.title}`
          }
          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          {isCurrentSong && isPlaying ? (
            <FaPause className="text-white" />
          ) : (
            <FaPlay className="text-white ml-0.5" />
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={handlePlay}
        className="min-w-0 flex-1 text-left"
      >
        <h3
          className={`font-medium truncate ${
            isCurrentSong
              ? "text-green-500"
              : "text-white"
          }`}
        >
          {song.title}
        </h3>

        <p className="text-sm text-zinc-400 truncate mt-0.5">
          {song.artist || "Unknown artist"}
        </p>
      </button>

      {/* Favourite Button */}
      <button
        type="button"
        onClick={handleFavourite}
        aria-label={
          isFavourite(song._id)
            ? "Remove from favourites"
            : "Add to favourites"
        }
        className="hidden md:flex w-9 h-9 items-center justify-center rounded-full text-zinc-400 hover:text-green-500 transition"
      >
        {isFavourite(song._id) ? (
          <FaHeart className="text-green-500" />
        ) : (
          <FaRegHeart />
        )}
      </button>

      {/* Mobile Play Button */}
      <button
        type="button"
        onClick={handlePlay}
        aria-label={
          isCurrentSong && isPlaying
            ? `Pause ${song.title}`
            : `Play ${song.title}`
        }
        className="md:hidden w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-white"
      >
        {isCurrentSong && isPlaying ? (
          <FaPause />
        ) : (
          <FaPlay />
        )}
      </button>
    </article>
  );
};

export default SongCard;