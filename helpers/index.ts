interface WordData {
  surah: number;
  ayah: number;
  word: number;
  text: string;
}

interface AyahData {
  surah: number;
  ayah: number;
  words: string[];
  wordObjects: WordData[];
}

export function getAyahs(words: WordData[]): AyahData[] {
  const groupedByAyah = words.reduce((acc: any, word: WordData) => {
    const key = `${word.surah}-${word.ayah}`;
    if (!acc[key]) {
      acc[key] = {
        surah: word.surah,
        ayah: word.ayah,
        words: [],
        wordObjects: [],
      };
    }
    acc[key].words.push(word.text);
    acc[key].wordObjects.push(word);
    return acc;
  }, {});

  return Object.values(groupedByAyah);
}