"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { sampleTracks, type Track } from "../lib/musicData";

interface MusicPlayerContextType {
  // Audio state
  audioRef: React.RefObject<HTMLAudioElement>;
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLooping: boolean;
  isShuffling: boolean;
  isLoading: boolean;

  // Current track
  currentTrack: Track;

  // Actions
  setCurrentTrackIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setIsLooping: (looping: boolean) => void;
  setIsShuffling: (shuffling: boolean) => void;
  setIsLoading: (loading: boolean) => void;

  // Player controls
  togglePlayPause: () => Promise<void>;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  formatTime: (time: number) => string;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

export function MusicPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [tracks] = useState<Track[]>(sampleTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentTrack = tracks[currentTrackIndex];

  // Format time helper
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Next track function
  const handleNext = useCallback(() => {
    let nextIndex;
    if (isShuffling) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
  }, [currentTrackIndex, tracks.length, isShuffling]);

  // Previous track
  const handlePrevious = useCallback(() => {
    const prevIndex =
      currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
  }, [currentTrackIndex, tracks.length]);

  // Play/Pause toggle
  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  }, [isPlaying]);

  // Seek to position
  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;

      audio.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration]
  );

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };
    const handleLoadStart = () => {
      setIsLoading(true);
    };
    const handleCanPlay = () => {
      setIsLoading(false);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };
    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isLooping, handleNext]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle track changes - update src and auto play if was playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Update the audio source when track changes
    audio.src = currentTrack.src;
    audio.load(); // Important: reload the audio with new source

    // Reset time when track changes
    setCurrentTime(0);
    setDuration(0);

    // If music was playing when track changed, continue playing the new track
    if (isPlaying) {
      const playNewTrack = async () => {
        try {
          await audio.play();
        } catch (error) {
          console.error("Error auto-playing new track:", error);
          setIsPlaying(false);
        }
      };

      // Wait a bit for the new track to load
      const timeoutId = setTimeout(playNewTrack, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [currentTrackIndex, isPlaying, currentTrack.src]);

  const value: MusicPlayerContextType = {
    audioRef,
    tracks,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLooping,
    isShuffling,
    isLoading,
    currentTrack,
    setCurrentTrackIndex,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    setIsLooping,
    setIsShuffling,
    setIsLoading,
    togglePlayPause,
    handleNext,
    handlePrevious,
    handleSeek,
    formatTime,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      {/* Global audio element */}
      <audio ref={audioRef} preload="metadata" style={{ display: "none" }} />
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}
