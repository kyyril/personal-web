"use client";

import React, { useState, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayIcon,
  PauseIcon,
  TrackNextIcon,
  TrackPreviousIcon,
  DragHandleDots2Icon,
  CaretLeftIcon,
} from "@radix-ui/react-icons";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
} from "./ui/dialog";
import MusicPlayer from "./MusicPlayer";
import Image from "next/image";

const MotionButton = ({ children, ...props }: any) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Button {...props}>{children}</Button>
  </motion.div>
);

const RotatingCover = ({ isPlaying, cover, title }: any) => (
  <motion.div
    animate={{ rotate: isPlaying ? 360 : 0 }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "linear",
    }}
    className="w-full h-full flex items-center justify-center"
  >
    {cover ? (
      <Image
        src={cover}
        alt={title}
        width={100}
        height={100}
        className="w-full h-full object-cover rounded-full"
      />
    ) : (
      <div className="w-6 h-6 bg-primary/20 rounded-full" />
    )}
  </motion.div>
);

const HiddenPlayer = ({ onShow }: any) => {
  const { currentTrack, isPlaying } = useMusicPlayer();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed p-2 top-4 left-4 z-40"
    >
      <Button
        variant="default"
        size="icon"
        onClick={onShow}
        className="rounded-full ring-1 ring-custom p-0 overflow-hidden"
      >
        {isPlaying ? (
          <RotatingCover
            isPlaying={isPlaying}
            cover={currentTrack.cover}
            title={currentTrack.title}
          />
        ) : (
          <PlayIcon className="h-4 w-4" />
        )}
      </Button>
    </motion.div>
  );
};

const VisiblePlayer = ({ onHide, position, setPosition }: any) => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    togglePlayPause,
    handleNext,
    handlePrevious,
  } = useMusicPlayer();
  const dragConstraintsRef = useRef(null);

  return (
    <AnimatePresence>
      <motion.div
        ref={dragConstraintsRef}
        className="fixed inset-0 z-40 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 100 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: position.x,
            y: position.y,
          }}
          exit={{ opacity: 0, scale: 0.9, y: 100 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          drag
          dragConstraints={dragConstraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            setPosition({
              x: position.x + info.offset.x,
              y: position.y + info.offset.y,
            });
          }}
          className="absolute pointer-events-auto cursor-move transform-gpu"
        >
          <Card className="bg-background/95 p-2 border-none backdrop-blur-sm border shadow-lg max-w-[280px]">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-4 h-8 cursor-move opacity-50 hover:opacity-100 transition-opacity">
                <DragHandleDots2Icon className="h-3 w-3" />
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1 min-w-0">
                    <div className="w-8 h-8 bg-muted rounded-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                      {currentTrack.cover ? (
                        <Image
                          width={100}
                          height={100}
                          src={currentTrack.cover}
                          alt={currentTrack.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-primary/20 rounded" />
                      )}
                    </div>
                    <div className="text-xs min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {currentTrack.title}
                      </p>
                      <p className="text-muted-foreground truncate">
                        {currentTrack.artist}
                      </p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-md border-none rounded-r-md">
                  <DialogHeader />
                  <MusicPlayer />
                </DialogContent>
              </Dialog>

              <div className="flex items-center gap-1 flex-shrink-0">
                <MotionButton
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevious}
                  className="h-7 w-7 transform-gpu"
                >
                  <TrackPreviousIcon className="h-3 w-3" />
                </MotionButton>

                <MotionButton
                  variant="default"
                  size="icon"
                  onClick={togglePlayPause}
                  disabled={isLoading}
                  className="h-8 w-8 transform-gpu"
                >
                  {isLoading ? (
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <PauseIcon className="h-3 w-3" />
                  ) : (
                    <PlayIcon className="h-3 w-3" />
                  )}
                </MotionButton>

                <MotionButton
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="h-7 w-7 transform-gpu"
                >
                  <TrackNextIcon className="h-3 w-3" />
                </MotionButton>

                <MotionButton
                  variant="ghost"
                  size="icon"
                  onClick={onHide}
                  className="h-7 w-7 opacity-60 hover:opacity-100 transform-gpu"
                >
                  <CaretLeftIcon className="h-3 w-3" />
                </MotionButton>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function FloatingMusicPlayer() {
  const { currentTrack, isPlaying, isLoading } = useMusicPlayer();
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 16, y: 8 });

  if (!currentTrack || (!isPlaying && !isLoading)) {
    return null;
  }

  return isVisible ? (
    <VisiblePlayer
      onHide={() => setIsVisible(false)}
      position={position}
      setPosition={setPosition}
    />
  ) : (
    <HiddenPlayer onShow={() => setIsVisible(true)} />
  );
}
