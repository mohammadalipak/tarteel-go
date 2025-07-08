import { useAppStore } from "@/store/useAppStore";
import {
  createWordKey,
  findCurrentWord,
  getVerseStartTime,
} from "@/utils/audioWordMapping";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import React, { createContext, useContext, useEffect, useMemo } from "react";

const AUDIO_URL = {
  MISHARY:
    "https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/73.mp3",
  SUDAIS:
    "https://download.quranicaudio.com/qdc/abdurrahmaan_as_sudais/murattal/73.mp3",
};

interface WordLocation {
  surah: number;
  ayah: number;
  wordIndex: number;
  segmentIndex?: number;
}

interface AudioPlayerContextType {
  player: any;
  status: any;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  currentWord: WordLocation | null;
  currentWordKey: string | null;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const player = useAudioPlayer({ uri: AUDIO_URL.MISHARY }, 200);
  setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
  });

  const status = useAudioPlayerStatus(player);
  const { startVerse, endVerse, playbackSpeed } = useAppStore();

  const currentTime = status.currentTime || 0;
  const duration = status.duration || 0;
  const isPlaying = status.playing || false;

  // Find the current word being played
  const currentWord = useMemo(() => {
    return findCurrentWord(currentTime);
  }, [currentTime]);

  // Create a unique key for the current word
  const currentWordKey = useMemo(() => {
    if (currentWord) {
      return createWordKey(
        currentWord.surah,
        currentWord.ayah,
        currentWord.wordIndex
      );
    }
    return null;
  }, [currentWord]);

  // Initialize player position to startVerse when ready
  useEffect(() => {
    if (duration > 0 && player.seekTo) {
      const startTime = getVerseStartTime(startVerse);
      if (startTime !== null) {
        player.seekTo(startTime);
      }
    }
  }, [duration, player, startVerse]); // Only run when duration becomes available

  // Monitor playback and pause when reaching end of verse range
  useEffect(() => {
    if (isPlaying && currentWord) {
      // If we've gone past the end verse, pause and seek to start verse
      if (currentWord.ayah > endVerse) {
        player.pause();
        const startTime = getVerseStartTime(startVerse);
        if (startTime !== null && player.seekTo) {
          player.seekTo(startTime);
        }
      }
    }
  }, [currentWord, endVerse, startVerse, isPlaying, player]);

  // Update playback speed when it changes in zustand store
  useEffect(() => {
    if (player && player.setPlaybackRate && isPlaying) {
      player.setPlaybackRate(playbackSpeed, "high");
    }
  }, [player, playbackSpeed, isPlaying]);

  return (
    <AudioPlayerContext.Provider
      value={{
        player,
        status,
        currentTime,
        duration,
        isPlaying,
        currentWord,
        currentWordKey,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPlayerContext must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
