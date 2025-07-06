import React, { createContext, useContext, useMemo } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { findCurrentWord, createWordKey } from '@/utils/audioWordMapping';

const AUDIO_URL = "https://download.quranicaudio.com/qdc/abdurrahmaan_as_sudais/murattal/73.mp3";

interface WordLocation {
  surah: number;
  ayah: number;
  wordIndex: number;
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

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const player = useAudioPlayer({ uri: AUDIO_URL }, 200);
  const status = useAudioPlayerStatus(player);

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
      return createWordKey(currentWord.surah, currentWord.ayah, currentWord.wordIndex);
    }
    return null;
  }, [currentWord]);

  return (
    <AudioPlayerContext.Provider value={{ 
      player, 
      status, 
      currentTime, 
      duration, 
      isPlaying,
      currentWord,
      currentWordKey
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayerContext must be used within an AudioPlayerProvider');
  }
  return context;
};