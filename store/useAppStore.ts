import { create } from 'zustand';

interface AppState {
  startVerse: number;
  endVerse: number;
  showRepetitionSettings: boolean;
  showSpeedSettings: boolean;
  showTranslation: boolean;
  playbackSpeed: number;
  sectionRepetition: number;
  verseRepetition: number;
  setStartVerse: (verse: number) => void;
  setEndVerse: (verse: number) => void;
  setShowRepetitionSettings: (show: boolean) => void;
  toggleRepetitionSettings: () => void;
  setSectionRepetition: (times: number) => void;
  setShowSpeedSettings: (show: boolean) => void;
  setShowTranslation: (show: boolean) => void;
  toggleTranslation: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setVerseRepetition: (times: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  startVerse: 1,
  endVerse: 20,
  showRepetitionSettings: false,
  showSpeedSettings: false,
  showTranslation: true,
  playbackSpeed: 1,
  sectionRepetition: 1,
  verseRepetition: 1,
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
  setSectionRepetition: (times) => set({ sectionRepetition: times }),
  setShowSpeedSettings: (show) => set({ showSpeedSettings: show }),
  setShowTranslation: (show) => set({ showTranslation: show }),
  toggleTranslation: () => set((state) => ({ showTranslation: !state.showTranslation })),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setVerseRepetition: (times) => set({ verseRepetition: times }),
}));