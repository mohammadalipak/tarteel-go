import React, { createContext, useContext, useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useAppStore } from '@/store/useAppStore';

const AUDIO_URL = "https://download.quranicaudio.com/qdc/abdurrahmaan_as_sudais/murattal/73.mp3";

interface AudioPlayerContextType {
  player: any;
  status: any;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setCurrentAudioTime, setAudioDuration } = useAppStore();
  const player = useAudioPlayer({ uri: AUDIO_URL }, 200);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (status.currentTime !== undefined) {
      setCurrentAudioTime(status.currentTime);
    }
  }, [status.currentTime, setCurrentAudioTime]);

  useEffect(() => {
    if (status.duration !== undefined) {
      setAudioDuration(status.duration);
    }
  }, [status.duration, setAudioDuration]);

  return (
    <AudioPlayerContext.Provider value={{ player, status }}>
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