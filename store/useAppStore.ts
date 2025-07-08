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
  isSliding: boolean;
  speedSettingsTimer: NodeJS.Timeout | null;
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
  setIsSliding: (sliding: boolean) => void;
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
  isSliding: false,
  speedSettingsTimer: null,
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
  setShowSpeedSettings: (show) => {
    const state = get();
    // Clear existing timer
    if (state.speedSettingsTimer) {
      clearTimeout(state.speedSettingsTimer);
    }
    
    set({ showSpeedSettings: show, speedSettingsTimer: null });
    
    // If showing speed settings, start timer to auto-hide after 3 seconds
    if (show) {
      const timer = setTimeout(() => {
        set({ showSpeedSettings: false, speedSettingsTimer: null });
      }, 3000);
      
      set({ speedSettingsTimer: timer });
    }
  },
  setShowTranslation: (show) => set({ showTranslation: show }),
  toggleTranslation: () => set((state) => ({ showTranslation: !state.showTranslation })),
  setPlaybackSpeed: (speed) => {
    const state = get();
    // Clear existing timer
    if (state.speedSettingsTimer) {
      clearTimeout(state.speedSettingsTimer);
    }
    
    // Set the new speed
    set({ playbackSpeed: speed });
    
    // If speed settings are showing, start timer to auto-hide after 3 seconds
    if (state.showSpeedSettings) {
      const timer = setTimeout(() => {
        set({ showSpeedSettings: false, speedSettingsTimer: null });
      }, 3000);
      
      set({ speedSettingsTimer: timer });
    }
  },
  setVerseRepetition: (times) => set({ verseRepetition: times }),
  setIsSliding: (sliding) => set({ isSliding: sliding }),
}));