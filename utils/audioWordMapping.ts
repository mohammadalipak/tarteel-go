import audioData from '@/assets/data/mishary_audio.json';

interface AudioSegment {
  surah: number;
  ayah: number;
  timestamp_from: number;
  timestamp_to: number;
  segments: string;
}

interface ParsedSegment {
  wordIndex: number;
  startTime: number;
  endTime: number;
}

interface WordLocation {
  surah: number;
  ayah: number;
  wordIndex: number;
  segmentIndex?: number;
}

// Parse the segments string into an array of word timings
const parseSegments = (segmentsString: string): ParsedSegment[] => {
  try {
    const segments = JSON.parse(segmentsString);
    return segments.map((segment: number[]) => ({
      wordIndex: segment[0],
      startTime: segment[1],
      endTime: segment[2],
    }));
  } catch (error) {
    console.error('Error parsing segments:', error);
    return [];
  }
};

// Find the current word being played based on audio time (in milliseconds)
export const findCurrentWord = (currentTimeMs: number): WordLocation | null => {
  // Convert seconds to milliseconds if needed
  const currentTime = currentTimeMs * 1000;

  for (const ayahData of audioData as AudioSegment[]) {
    if (currentTime >= ayahData.timestamp_from && currentTime <= ayahData.timestamp_to) {
      const segments = parseSegments(ayahData.segments);

      for (const segment of segments) {
        if (currentTime >= segment.startTime && currentTime <= segment.endTime) {
          return {
            surah: ayahData.surah,
            ayah: ayahData.ayah,
            wordIndex: segment.wordIndex,
          };
        }
      }
    }
  }

  return null;
};

// Create a unique key for word identification
export const createWordKey = (surah: number, ayah: number, wordIndex: number): string => {
  return `${surah}-${ayah}-${wordIndex}`;
};

// Get the timestamp for the start of a specific verse
export const getVerseStartTime = (ayah: number): number | null => {
  const ayahData = (audioData as AudioSegment[]).find(segment => segment.ayah === ayah);
  return ayahData ? ayahData.timestamp_from / 1000 : null; // Convert to seconds
};

// Get the timestamp for the end of a specific verse
export const getVerseEndTime = (ayah: number): number | null => {
  const ayahData = (audioData as AudioSegment[]).find(segment => segment.ayah === ayah);
  return ayahData ? ayahData.timestamp_to / 1000 : null; // Convert to seconds
};

// Check if a time position is within the allowed verse range
export const isTimeInVerseRange = (timeMs: number, startVerse: number, endVerse: number): boolean => {
  const currentWord = findCurrentWord(timeMs);
  if (!currentWord) return false;

  return currentWord.ayah >= startVerse && currentWord.ayah <= endVerse;
};

// Find the next verse relative to current time
export const findNextVerse = (currentTimeMs: number): number | null => {
  const currentTime = currentTimeMs * 1000;

  for (const ayahData of audioData as AudioSegment[]) {
    if (ayahData.timestamp_from > currentTime) {
      return ayahData.timestamp_from / 1000; // Convert back to seconds
    }
  }

  return null; // No next verse found
};

// Find the previous verse relative to current time
export const findPreviousVerse = (currentTimeMs: number): number | null => {
  const currentTime = currentTimeMs * 1000;

  // Find current verse
  let currentVerseIndex = -1;
  for (let i = 0; i < audioData.length; i++) {
    const ayahData = audioData[i] as AudioSegment;
    if (currentTime >= ayahData.timestamp_from && currentTime <= ayahData.timestamp_to) {
      currentVerseIndex = i;
      break;
    }
  }

  // If we're in the first few seconds of the current verse, go to previous verse
  // Otherwise, go to the beginning of the current verse
  if (currentVerseIndex !== -1) {
    const currentVerse = audioData[currentVerseIndex] as AudioSegment;
    const timeIntoVerse = currentTime - currentVerse.timestamp_from;

    // If we're more than 3 seconds into the verse, restart current verse
    if (timeIntoVerse > 3000) {
      return currentVerse.timestamp_from / 1000;
    }

    // Otherwise, go to previous verse
    if (currentVerseIndex > 0) {
      const previousVerse = audioData[currentVerseIndex - 1] as AudioSegment;
      return previousVerse.timestamp_from / 1000;
    }
  }

  return null; // No previous verse found or already at beginning
};