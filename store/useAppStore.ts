import { create } from 'zustand';

interface AppState {
  startVerse: number;
  endVerse: number;
  showRepetitionSettings: boolean;
  showSpeedSettings: boolean;
  playbackSpeed: number;
  setStartVerse: (verse: number) => void;
  setEndVerse: (verse: number) => void;
  setShowRepetitionSettings: (show: boolean) => void;
  toggleRepetitionSettings: () => void;
  setShowSpeedSettings: (show: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  startVerse: 1,
  endVerse: 20,
  showRepetitionSettings: false,
  showSpeedSettings: false,
  playbackSpeed: 1,
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
  setShowRepetitionSettings: (show) => set({ showRepetitionSettings: show }),
  toggleRepetitionSettings: () => set((state) => ({ showRepetitionSettings: !state.showRepetitionSettings })),
  setShowSpeedSettings: (show) => set({ showSpeedSettings: show }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
}));