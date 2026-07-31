import {
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
  FaVolumeDown,
  FaVolumeMute,
  FaVolumeUp,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = Math.floor(
    seconds % 60
  )
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

const Player = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    changeVolume,
  } = usePlayer();

  const {
    isFavourite,
    toggleFavouriteSong,
  } = useAuth();

  const VolumeIcon =
    volume === 0
      ? FaVolumeMute
      : volume < 0.5
      ? FaVolumeDown
      : FaVolumeUp;

  const initial =
    currentSong?.title
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "♪";

  return (
    <footer className="h-20 sm:h-24 shrink-0 bg-black border-t border-white/5 grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[1fr_1.5fr_1fr] items-center gap-3 md:gap-6 px-3 sm:px-5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="hidden sm:flex w-14 h-14 shrink-0 rounded overflow-hidden bg-linear-to-br from-green-600 via-green-950 to-black items-center justify-center shadow-lg">
          {currentSong?.coverImage ? (
            <img
              src={currentSong.coverImage}
              alt={`${currentSong.title} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-black text-lg text-white/90">
              {initial}
            </span>
          )}
        </div>

        <div className="min-w-0 flex items-center gap-3">
          <div className="min-w-0">
            <p
              className={`text-sm font-medium truncate ${
                currentSong
                  ? "text-white"
                  : "text-zinc-400"
              }`}
            >
              {currentSong?.title ||
                "Choose a song"}
            </p>

            <p className="text-xs text-zinc-500 truncate mt-0.5">
              {currentSong?.artist ||
                "Nothing playing"}
            </p>
          </div>

          {currentSong && (
            <button
              type="button"
              onClick={() =>
                toggleFavouriteSong(currentSong)
              }
              aria-label={
                isFavourite(currentSong._id)
                  ? "Remove from favourites"
                  : "Add to favourites"
              }
              className="text-lg transition hover:scale-110"
            >
              {isFavourite(currentSong._id) ? (
                <FaHeart className="text-green-500" />
              ) : (
                <FaRegHeart className="text-zinc-400 hover:text-green-500" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 min-w-0">
        <div className="flex items-center gap-5 sm:gap-7">
          <button
            type="button"
            onClick={playPrevious}
            disabled={!currentSong}
            aria-label="Previous song"
            className="text-zinc-400 hover:text-white disabled:opacity-30 transition hover:scale-105"
          >
            <FaStepBackward />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            disabled={!currentSong}
            aria-label={
              isPlaying ? "Pause" : "Play"
            }
            className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 disabled:opacity-40 transition"
          >
            {isPlaying ? (
              <FaPause />
            ) : (
              <FaPlay className="ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={playNext}
            disabled={!currentSong}
            aria-label="Next song"
            className="text-zinc-400 hover:text-white disabled:opacity-30 transition hover:scale-105"
          >
            <FaStepForward />
          </button>
        </div>

        <div className="hidden sm:flex w-full max-w-xl items-center gap-3 text-[11px] text-zinc-400">
          <span className="w-9 text-right">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(
              currentTime,
              duration || 0
            )}
            onChange={(event) =>
              seek(Number(event.target.value))
            }
            disabled={!currentSong || !duration}
            aria-label="Song progress"
            className="player-range flex-1"
          />

          <span className="w-9">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-end gap-3">
        <VolumeIcon className="text-zinc-400" />

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) =>
            changeVolume(
              Number(event.target.value)
            )
          }
          aria-label="Volume"
          className="player-range w-24"
        />
      </div>
    </footer>
  );
};

export default Player;