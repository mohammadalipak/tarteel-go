import { Fragment, useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import Words from "@/assets/data/text_quran.json";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { useAppStore } from "@/store/useAppStore";
import { createWordKey, getVerseStartTime } from "@/utils/audioWordMapping";
import { getAyahs } from "../helpers";
import BoldableWord from "./BoldableWord";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const SCROLL_THROTTLE_MS = 150;

const Mushaf: React.FC<ChildProps> = ({ style }) => {
  const { currentWordKey, currentWord, player } = useAudioPlayerContext();
  const { startVerse, endVerse } = useAppStore();
  const flatListRef = useRef<FlatList>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const pendingScrollRef = useRef<typeof currentWord>(null);

  // Get all ayahs data and filter by verse range
  const allAyahsData = getAyahs(Words);
  const ayahsData = allAyahsData.filter(
    (ayah) => ayah.ayah >= startVerse && ayah.ayah <= endVerse
  );

  // Scroll execution function
  const executeScroll = useCallback(
    (word: typeof currentWord) => {
      if (word && flatListRef.current) {
        const ayahIndex = ayahsData.findIndex(
          (ayah) => ayah.surah === word.surah && ayah.ayah === word.ayah
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
            console.warn("ScrollToIndex failed, using scrollToOffset:", error);
            const estimatedOffset = ayahIndex * 100; // Rough estimate
            flatListRef.current.scrollToOffset({
              offset: estimatedOffset,
              animated: true,
            });
          }
        }
      }
    },
    [ayahsData]
  );

  // Throttled scroll function
  const throttledScrollToWord = useCallback(
    (word: typeof currentWord) => {
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTimeRef.current;
      const throttleDelay = SCROLL_THROTTLE_MS;

      if (timeSinceLastScroll >= throttleDelay) {
        // Execute immediately if enough time has passed
        executeScroll(word);
        lastScrollTimeRef.current = now;
        pendingScrollRef.current = null;
      } else {
        // Store the pending scroll and schedule it
        pendingScrollRef.current = word;
        setTimeout(() => {
          if (
            pendingScrollRef.current &&
            Date.now() - lastScrollTimeRef.current >= throttleDelay
          ) {
            executeScroll(pendingScrollRef.current);
            lastScrollTimeRef.current = Date.now();
            pendingScrollRef.current = null;
          }
        }, throttleDelay - timeSinceLastScroll);
      }
    },
    [executeScroll]
  );

  // Auto-scroll when current word changes (throttled)
  useEffect(() => {
    throttledScrollToWord(currentWord);
  }, [currentWord, throttledScrollToWord]);

  const handleVersePress = (surah: number, ayah: number) => {
    const verseStartTime = getVerseStartTime(ayah);
    if (verseStartTime !== null && player && player.seekTo) {
      player.seekTo(verseStartTime);
      player.play();
    }
  };

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
          console.warn("Scroll to index failed:", info);
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.33,
            });
          });
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => handleVersePress(item.surah, item.ayah)}
            >
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
    paddingLeft: 30,
  } as ViewStyle,
  word: {
    color: "rgba(255,255,255,0.1)",
    fontSize: 32,
    fontFamily: "UthmanicHafs",
    marginLeft: 5,
    writingDirection: "rtl",
  } as TextStyle,
  highlightedWord: {
    color: "rgba(255,255,255,0.7)",
  } as TextStyle,
  currentWord: {
    color: "#ffffff",
    textShadowColor: "rgba(200,200,200,.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  } as TextStyle,
});

export default Mushaf;
