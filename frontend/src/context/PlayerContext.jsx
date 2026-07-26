import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const PlayerContext = createContext(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }

  return context;
};

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());

  const [queue, setQueue] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const currentSongRef = useRef(null);
  const queueRef = useRef([]);

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const playSong = (song, songs = []) => {
    if (!song?.uri) {
      return;
    }

    const audio = audioRef.current;

    if (songs.length > 0) {
      setQueue(songs);
      queueRef.current = songs;
    }

    if (currentSongRef.current?._id !== song._id) {
      audio.src = song.uri;
      audio.currentTime = 0;

      setCurrentSong(song);
      currentSongRef.current = song;

      setCurrentTime(0);
      setDuration(0);
    }

    audio.play().catch((error) => {
      console.error("Unable to play audio:", error);
      setIsPlaying(false);
    });
  };

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!currentSongRef.current) {
      const firstSong = queueRef.current[0];

      if (firstSong) {
        playSong(firstSong, queueRef.current);
      }

      return;
    }

    if (audio.paused) {
      audio.play().catch((error) => {
        console.error("Unable to play audio:", error);
      });
    } else {
      audio.pause();
    }
  };

  const playNext = () => {
    const currentQueue = queueRef.current;
    const activeSong = currentSongRef.current;

    if (!activeSong || currentQueue.length === 0) {
      return;
    }

    const currentIndex = currentQueue.findIndex(
      (song) => song._id === activeSong._id
    );

    if (currentIndex === -1) {
      return;
    }

    const nextIndex = (currentIndex + 1) % currentQueue.length;

    playSong(currentQueue[nextIndex], currentQueue);
  };

  const playPrevious = () => {
    const audio = audioRef.current;
    const currentQueue = queueRef.current;
    const activeSong = currentSongRef.current;

    if (!activeSong || currentQueue.length === 0) {
      return;
    }

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    const currentIndex = currentQueue.findIndex(
      (song) => song._id === activeSong._id
    );

    if (currentIndex === -1) {
      return;
    }

    const previousIndex =
      currentIndex === 0 ? currentQueue.length - 1 : currentIndex - 1;

    playSong(currentQueue[previousIndex], currentQueue);
  };

  const seek = (time) => {
    const audio = audioRef.current;

    if (!Number.isFinite(time)) {
      return;
    }

    audio.currentTime = time;
    setCurrentTime(time);
  };

  const changeVolume = (newVolume) => {
    const safeVolume = Math.min(Math.max(newVolume, 0), 1);

    audioRef.current.volume = safeVolume;
    setVolume(safeVolume);
  };

  useEffect(() => {
    const audio = audioRef.current;

    audio.volume = volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(
        Number.isFinite(audio.duration) ? audio.duration : 0
      );
    };

    const handleDurationChange = () => {
      setDuration(
        Number.isFinite(audio.duration) ? audio.duration : 0
      );
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      const currentQueue = queueRef.current;
      const activeSong = currentSongRef.current;

      if (!activeSong || currentQueue.length === 0) {
        setIsPlaying(false);
        return;
      }

      const currentIndex = currentQueue.findIndex(
        (song) => song._id === activeSong._id
      );

      if (currentIndex === -1) {
        setIsPlaying(false);
        return;
      }

      const nextIndex = (currentIndex + 1) % currentQueue.length;
      playSong(currentQueue[nextIndex], currentQueue);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();

      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        playSong,
        togglePlay,
        playNext,
        playPrevious,
        seek,
        changeVolume,
        setQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};