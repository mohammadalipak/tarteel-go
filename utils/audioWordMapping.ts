import audioData from '@/assets/data/audio_quran.json';

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