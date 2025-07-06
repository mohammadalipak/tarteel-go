import { Fragment, useEffect, useRef } from "react";
import {
  FlatList,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  Dimensions,
} from "react-native";

import Words from "@/assets/data/text_quran.json";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { createWordKey } from "@/utils/audioWordMapping";
import { getAyahs } from "../helpers";
import BoldableWord from "./BoldableWord";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const Mushaf: React.FC<ChildProps> = ({ style }) => {
  const { currentWordKey, currentWord } = useAudioPlayerContext();
  const flatListRef = useRef<FlatList>(null);
  const ayahRefs = useRef<{ [key: string]: View | null }>({});
  const screenHeight = Dimensions.get('window').height;
  const scrollToPosition = screenHeight * (1/3); // Top 1/3 of screen

  // Get all ayahs data for reference
  const ayahsData = getAyahs(Words);

  // Auto-scroll when current word changes
  useEffect(() => {
    if (currentWord && flatListRef.current) {
      const ayahIndex = ayahsData.findIndex(ayah => 
        ayah.surah === currentWord.surah && ayah.ayah === currentWord.ayah
      );
      
      if (ayahIndex !== -1) {
        try {
          // Scroll to the ayah containing the current word with offset for top 2/3
          flatListRef.current.scrollToIndex({
            index: ayahIndex,
            viewPosition: 0.33, // Position at top 1/3 of screen
            animated: true,
          });
        } catch (error) {
          // Fallback to scrollToOffset if scrollToIndex fails
          console.warn('ScrollToIndex failed, using scrollToOffset:', error);
          const estimatedOffset = ayahIndex * 100; // Rough estimate
          flatListRef.current.scrollToOffset({
            offset: estimatedOffset,
            animated: true,
          });
        }
      }
    }
  }, [currentWord, ayahsData]);

  const renderWord = (
    word: string,
    wordIndex: number,
    surah: number,
    ayah: number
  ) => {
    // Create word key for this specific word (wordIndex is 0-based, but audio data is 1-based)
    const wordKey = createWordKey(surah, ayah, wordIndex + 1);
    const isCurrentWord = currentWordKey === wordKey;

    // Check if this word should be highlighted (in current verse and before/at current word)
    const shouldHighlight =
      currentWord &&
      currentWord.surah === surah &&
      currentWord.ayah === ayah &&
      wordIndex + 1 <= currentWord.wordIndex;

    return (
      <Fragment key={`word-fragment-${surah}-${ayah}-${wordIndex}`}>
        <BoldableWord
          // bold={shouldHighlight || false}
          bold
          style={[
            styles.word,
            shouldHighlight && styles.highlightedWord,
            isCurrentWord && styles.currentWord,
          ]}
          text={word}
        ></BoldableWord>
      </Fragment>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{ paddingRight: 30 }}
        data={ayahsData}
        keyExtractor={(item) => `${item.surah}-${item.ayah}`}
        onScrollToIndexFailed={(info) => {
          // Handle failed scroll attempts
          console.warn('Scroll to index failed:', info);
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ 
              index: info.index, 
              animated: true,
              viewPosition: 0.33
            });
          });
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity>
              <View style={styles.ayahContainer}>
                {item.words.map((word: string, index: number) =>
                  renderWord(word, index, item.surah, item.ayah)
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ayahContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  } as ViewStyle,
  container: { 
    flexDirection: "row", 
    paddingLeft: 30 
  } as ViewStyle,
  word: {
    color: "rgba(255,255,255,0.1)",
    fontSize: 30,
    fontFamily: "UthmanicHafs",
    marginLeft: 2,
    writingDirection: "rtl",
  } as TextStyle,
  highlightedWord: {
    color: "rgba(255,255,255,0.7)",
  } as TextStyle,
  currentWord: {
    color: "#ffffff",
    textShadowColor: "rgba(200,200,200,.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  } as TextStyle,
});

export default Mushaf;
