import { create } from 'zustand';

interface AppState {
  startVerse: number;
  endVerse: number;
  isAudioPlaying: boolean;
  currentAudioTime: number;
  audioDuration: number;
  showRepetitionSettings: boolean;
  setStartVerse: (verse: number) => void;
  setEndVerse: (verse: number) => void;
  setCurrentAudioTime: (time: number) => void;
  setAudioDuration: (duration: number) => void;
  setIsAudioPlaying: (playing: boolean) => void;
  setShowRepetitionSettings: (show: boolean) => void;
  toggleRepetitionSettings: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  startVerse: 7,
  endVerse: 20,
  isAudioPlaying: false,
  currentAudioTime: 0,
  audioDuration: 0,
  showRepetitionSettings: false,
  setStartVerse: (verse) => {
    set({ startVerse: verse });
    // If the new start verse is greater than or equal to the current end verse,
    // update the end verse to match the start verse
    const { endVerse } = get();
    if (verse >= endVerse) {
      set({ endVerse: verse });
    }
  },
  setEndVerse: (verse) => set({ endVerse: verse }),
  setCurrentAudioTime: (time) => set({ currentAudioTime: time }),
  setAudioDuration: (duration) => set({ audioDuration: duration }),
  setIsAudioPlaying: (playing) => set({ isAudioPlaying: playing }),
  setShowRepetitionSettings: (show) => set({ showRepetitionSettings: show }),
  toggleRepetitionSettings: () => set((state) => ({ showRepetitionSettings: !state.showRepetitionSettings })),
}));