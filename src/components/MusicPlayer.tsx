"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext"; // Adjust path as needed
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
        <Card className="p-3 bg-background/95 backdrop-blur-sm border shadow-lg">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              disabled={isLoading}
              className="h-8 w-8"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
      className={cn("w-full", className)}
      style={{
        willChange: "transform, opacity",
        transform: "translateZ(0)", // Hardware acceleration
      }}
    >
      <Card className="p-4 bg-background/95 backdrop-blur-sm border">
        {/* Track Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
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
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate text-base sm:text-lg md:text-xl max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
              {currentTrack.title}
            </h3>

            <p className="text-sm text-muted-foreground truncate">
              {currentTrack.artist}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="h-8 w-8"
          >
            <ListBulletIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div
            className="w-full h-2 bg-muted rounded-full cursor-pointer group"
            onClick={handleSeek}
            style={{ willChange: "transform" }}
          >
            <motion.div
              className="h-full bg-primary rounded-full group-hover:bg-primary/80"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                willChange: "width",
                transform: "translateZ(0)", // Hardware acceleration
              }}
              transition={{
                duration: 0.1,
                ease: "linear",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsShuffling(!isShuffling)}
              className={cn("h-8 w-8", isShuffling && "text-primary")}
            >
              <ShuffleIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLooping(!isLooping)}
              className={cn("h-8 w-8", isLooping && "text-primary")}
            >
              <LoopIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="h-8 w-8"
                style={{ willChange: "transform" }}
              >
                <TrackPreviousIcon className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="default"
                size="icon"
                onClick={togglePlayPause}
                disabled={isLoading}
                className="h-10 w-10"
                style={{ willChange: "transform" }}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
                    />
                  ) : isPlaying ? (
                    <motion.div
                      key="pause"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <PauseIcon className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <PlayIcon className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="h-8 w-8"
                style={{ willChange: "transform" }}
              >
                <TrackNextIcon className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            <VolumeIcon className="h-4 w-4 text-muted-foreground" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer slider"
              style={{
                willChange: "transform",
                transform: "translateZ(0)",
              }}
            />
          </div>
        </div>

        {/* Playlist */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 border-t pt-4"
            >
              <h4 className="font-medium mb-2">Playlist</h4>
              <div
                className="space-y-1 max-h-32 overflow-y-auto"
                style={{
                  willChange: "scroll-position",
                  transform: "translateZ(0)",
                }}
              >
                {tracks.map((track, index) => (
                  <motion.div
                    key={track.id}
                    onClick={() => setCurrentTrackIndex(index)}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-muted/50 transition-colors",
                      index === currentTrackIndex && "bg-muted"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    style={{ willChange: "transform" }}
                  >
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs">
                      {index === currentTrackIndex && isPlaying ? (
                        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {track.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {track.artist}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(track.duration)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
