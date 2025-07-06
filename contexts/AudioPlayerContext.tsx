import React, { createContext, useContext } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

const AUDIO_URL = "https://download.quranicaudio.com/qdc/abdurrahmaan_as_sudais/murattal/73.mp3";

interface AudioPlayerContextType {
  player: any;
  status: any;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const player = useAudioPlayer({ uri: AUDIO_URL }, 200);
  const status = useAudioPlayerStatus(player);

  const currentTime = status.currentTime || 0;
  const duration = status.duration || 0;
  const isPlaying = status.playing || false;

  return (
    <AudioPlayerContext.Provider value={{ 
      player, 
      status, 
      currentTime, 
      duration, 
      isPlaying 
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