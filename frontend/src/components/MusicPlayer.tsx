"use client";

import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayIcon,
  PauseIcon,
  TrackNextIcon,
  TrackPreviousIcon,
  SpeakerLoudIcon,
  SpeakerModerateIcon,
  SpeakerQuietIcon,
  SpeakerOffIcon,
  LoopIcon,
  ShuffleIcon,
  ListBulletIcon,
} from "@radix-ui/react-icons";
import { cn } from "../lib/utils";
import { useMusicPlayer } from "../contexts/MusicPlayerContext"; // Adjust path as needed
import Image from "next/image";

interface MusicPlayerProps {
  className?: string;
  compact?: boolean;
}

export default function MusicPlayer({
  className,
  compact = false,
}: MusicPlayerProps) {
  const {
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
    setVolume,
    setIsLooping,
    setIsShuffling,
    setCurrentTrackIndex,
    togglePlayPause,
    handleNext,
    handlePrevious,
    handleSeek,
    formatTime,
  } = useMusicPlayer();

  const [showPlaylist, setShowPlaylist] = useState(false);

  // Volume icon based on level
  const getVolumeIcon = () => {
    if (volume === 0) return SpeakerOffIcon;
    if (volume < 0.3) return SpeakerQuietIcon;
    if (volume < 0.7) return SpeakerModerateIcon;
    return SpeakerLoudIcon;
  };

  const VolumeIcon = getVolumeIcon();

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        className={cn("fixed bottom-20 right-4 z-40", className)}
        style={{
          willChange: "transform, opacity",
          transform: "translateZ(0)",
        }}
      >
        <Card className="p-3 bg-background/95 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              disabled={isLoading}
              className="h-8 w-8"
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              {isLoading ? (
                <div className="w-4 h-4 rounded-full animate-spin" />
              ) : isPlaying ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </Button>
            <div className="text-xs">
              <p className="font-medium truncate max-w-[120px]">
                {currentTrack.title}
              </p>
              <p className="text-muted-foreground truncate max-w-[120px]">
                {currentTrack.artist}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={cn("w-full bg-background/95 backdrop-blur-sm rounded-lg p-4", className)}
      style={{
        willChange: "transform, opacity",
        transform: "translateZ(0)", // Hardware acceleration
      }}
    >
      {/* Track Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
          {currentTrack.cover ? (
            <Image
              width={100}
              height={100}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-primary/20 rounded" />
          )}
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <div className="overflow-hidden w-full whitespace-nowrap mb-1">
            <p
              className="inline-block font-semibold text-base sm:text-lg"
              style={{
                animation: currentTrack.title.length > 20 ? "marquee 10s linear infinite" : "none",
              }}
            >
              {currentTrack.title}
            </p>
            <style jsx>{`
                @keyframes marquee {
                  0% {
                    transform: translateX(100%);
                  }
                  100% {
                    transform: translateX(-100%);
                  }
                }
              `}</style>
          </div>

          <p className="text-sm text-muted-foreground truncate">
            {currentTrack.artist}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="h-9 w-9 hover:bg-muted"
          aria-label={showPlaylist ? "Hide playlist" : "Show playlist"}
        >
          <ListBulletIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div
          className="w-full h-1.5 bg-muted rounded-full cursor-pointer group relative"
          onClick={handleSeek}
        >
          <motion.div
            className="h-full bg-primary rounded-full group-hover:bg-primary/80 relative"
            style={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            }}
            transition={{
              duration: 0.1,
              ease: "linear"
            }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsShuffling(!isShuffling)}
            className={cn("h-8 w-8", isShuffling && "text-primary bg-primary/10")}
            aria-label={isShuffling ? "Disable shuffle" : "Enable shuffle"}
          >
            <ShuffleIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsLooping(!isLooping)}
            className={cn("h-8 w-8", isLooping && "text-primary bg-primary/10")}
            aria-label={isLooping ? "Disable loop" : "Enable loop"}
          >
            <LoopIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="h-10 w-10 hover:bg-muted"
              aria-label="Previous track"
            >
              <TrackPreviousIcon className="h-6 w-6" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="default"
              size="icon"
              onClick={togglePlayPause}
              disabled={isLoading}
              className="h-14 w-14 rounded-full shadow-lg"
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              {isLoading ? (
                <div className="w-6 h-6 rounded-full animate-spin border-2 border-background border-t-transparent" />
              ) : isPlaying ? (
                <PauseIcon className="h-7 w-7" />
              ) : (
                <PlayIcon className="h-7 w-7 ml-1" />
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="h-10 w-10 hover:bg-muted"
              aria-label="Next track"
            >
              <TrackNextIcon className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 w-24 justify-end">
          <VolumeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="w-16 h-1 bg-muted rounded-full relative overflow-hidden">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div
              className="h-full bg-primary/70"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Playlist */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 20 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <h4 className="font-medium mb-3 text-sm uppercasetracking-wider text-muted-foreground">Playlist</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {tracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  onClick={() => setCurrentTrackIndex(index)}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors group",
                    index === currentTrackIndex ? "bg-primary/10" : "hover:bg-muted"
                  )}
                  whileHover={{ x: 4 }}
                >
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center text-xs font-mono",
                    index === currentTrackIndex ? "text-primary" : "text-muted-foreground"
                  )}>
                    {index === currentTrackIndex && isPlaying ? (
                      <div className="flex gap-0.5 h-3 items-end">
                        <span className="w-0.5 bg-primary h-full animate-music-bar-1" />
                        <span className="w-0.5 bg-primary h-2/3 animate-music-bar-2" />
                        <span className="w-0.5 bg-primary h-full animate-music-bar-3" />
                      </div>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      index === currentTrackIndex ? "text-primary" : "text-foreground"
                    )}>
                      {track.title}
                    </p>

                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
