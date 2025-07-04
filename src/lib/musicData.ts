export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  src: string;
  cover: string;
  genre?: string;
  album?: string;
  year?: number;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  cover?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sample tracks with placeholder data
// Note: You'll need to add actual audio files to the public/music directory
export const sampleTracks: Track[] = [
  {
    id: 2,
    title: "Dango Daikozoku - Clannad END Cover Katou Megumi",
    artist: "Katou Megumi",
    duration: 240,
    src: "/music/daikozoku.mp3",
    cover: "/assets/music-covers/daikozoku.jpeg",
  },
  {
    id: 2,
    title: "Aternal - Cover Katou Megumi",
    artist: "Katou Megumi",
    duration: 240,
    src: "/music/ETERNAL.mp3",
    cover: "/assets/music-covers/eternal.jpeg",
  },
  {
    id: 3,
    title: "Kisetsu Wo Dakishimete - Cover Katou Megumi",
    artist: "Katou Megumi",
    duration: 240, // 4 minutes
    src: "/music/kisetsu-dakishimete.mp3",
    cover: "/assets/music-covers/kisetsu.webp",
  },
  {
    id: 4,
    title: "Glistening - Cover Katou Megumi",
    artist: "Katou Megumi",
    duration: 180, // 3 minutes
    src: "/music/Glistening.mp3",
    cover: "/assets/music-covers/glistening.jpeg",
  },
];

// Music player settings
export interface MusicPlayerSettings {
  volume: number;
  isShuffling: boolean;
  isLooping: boolean;
  currentPlaylistId: string;
  currentTrackIndex: number;
  isPlaying: boolean;
}

export const defaultMusicPlayerSettings: MusicPlayerSettings = {
  volume: 0.7,
  isShuffling: false,
  isLooping: false,
  currentPlaylistId: "all-tracks",
  currentTrackIndex: 0,
  isPlaying: false,
};

// Local storage keys
export const MUSIC_PLAYER_STORAGE_KEYS = {
  SETTINGS: "katou-music-player-settings",
  PLAYLISTS: "katou-music-playlists",
  CURRENT_TIME: "katou-music-current-time",
} as const;

// Utility functions
export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getNextTrackIndex = (
  currentIndex: number,
  tracksLength: number,
  isShuffling: boolean
): number => {
  if (isShuffling) {
    return Math.floor(Math.random() * tracksLength);
  }
  return (currentIndex + 1) % tracksLength;
};

export const getPreviousTrackIndex = (
  currentIndex: number,
  tracksLength: number
): number => {
  return currentIndex === 0 ? tracksLength - 1 : currentIndex - 1;
};

// Music player state management helpers
export const saveMusicPlayerSettings = (
  settings: MusicPlayerSettings
): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      MUSIC_PLAYER_STORAGE_KEYS.SETTINGS,
      JSON.stringify(settings)
    );
  }
};

export const loadMusicPlayerSettings = (): MusicPlayerSettings => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(MUSIC_PLAYER_STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        return { ...defaultMusicPlayerSettings, ...JSON.parse(saved) };
      } catch (error) {
        console.error("Error loading music player settings:", error);
      }
    }
  }
  return defaultMusicPlayerSettings;
};

export const saveCurrentTime = (trackId: number, time: number): void => {
  if (typeof window !== "undefined") {
    const currentTimes = getCurrentTimes();
    currentTimes[trackId] = time;
    localStorage.setItem(
      MUSIC_PLAYER_STORAGE_KEYS.CURRENT_TIME,
      JSON.stringify(currentTimes)
    );
  }
};

export const getCurrentTime = (trackId: number): number => {
  const currentTimes = getCurrentTimes();
  return currentTimes[trackId] || 0;
};

const getCurrentTimes = (): Record<number, number> => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(MUSIC_PLAYER_STORAGE_KEYS.CURRENT_TIME);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Error loading current times:", error);
      }
    }
  }
  return {};
};
