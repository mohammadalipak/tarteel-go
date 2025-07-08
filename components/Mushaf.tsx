import MaskedView from "@react-native-masked-view/masked-view";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import {
  FlatList,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import Words from "@/assets/data/text_quran.json";
import Translations from "@/assets/data/translation_quran.json";
import TranslationOffIcon from "@/assets/images/translation-off.svg";
import TranslationOnIcon from "@/assets/images/translation-on.svg";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { useAppStore } from "@/store/useAppStore";
import { createWordKey, getVerseStartTime } from "@/utils/audioWordMapping";
import { getAyahs } from "../helpers";
import BoldableWord from "./BoldableWord";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const SCROLL_THROTTLE_MS = 150;

const SEMANTIC_STOPS = ["اۚ", "هُۚ", "كَۚ", "رَۚ", "نِۚ"];

const Mushaf: React.FC<ChildProps> = ({ style }) => {
  const { currentWordKey, currentWord, player } = useAudioPlayerContext();
  const { startVerse, endVerse, showTranslation, toggleTranslation } =
    useAppStore();
  const flatListRef = useRef<FlatList>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const pendingScrollRef = useRef<typeof currentWord>(null);

  // Get all ayahs data and filter by verse range
  const allAyahsData = getAyahs(Words);
  const ayahsData = allAyahsData.filter(
    (ayah) => ayah.ayah >= startVerse && ayah.ayah <= endVerse
  );

  const handleVersePress = (ayah: number) => {
    const verseStartTime = getVerseStartTime(ayah);
    if (verseStartTime !== null && player && player.seekTo) {
      player.seekTo(verseStartTime);
      player.play();
    }
  };

  const getTranslationWords = (surah: number, ayah: number) => {
    return Translations.filter(
      (translation: any) =>
        translation.surah_number === surah && translation.ayah_number === ayah
    );
  };

  const splitVerseIntoSegments = (
    words: string[],
    surah: number,
    ayah: number
  ) => {
    const segments = [];
    let currentSegment = [];
    let currentWordIndex = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      currentSegment.push({ word, wordIndex: currentWordIndex });
      currentWordIndex++;

      // Check if word contains a semantic stop
      const hasSemanticStop = SEMANTIC_STOPS.some((stop) =>
        word.includes(stop)
      );

      if (hasSemanticStop || i === words.length - 1) {
        // End current segment and start new one
        segments.push({
          type: "arabic",
          surah,
          ayah,
          words: currentSegment,
          segmentIndex: segments.length,
        });

        // Add translation segment if enabled
        if (showTranslation) {
          const translationWords = getTranslationWords(surah, ayah).slice(
            currentWordIndex - currentSegment.length,
            currentWordIndex
          );

          segments.push({
            type: "translation",
            surah,
            ayah,
            words: translationWords,
            segmentIndex: segments.length,
          });
        }

        currentSegment = [];
      }
    }

    return segments;
  };

  // Function to determine which segment a word belongs to
  const getWordSegmentIndex = useCallback((
    surah: number,
    ayah: number,
    wordIndex: number
  ): number => {
    const ayahData = ayahsData.find(
      (a) => a.surah === surah && a.ayah === ayah
    );
    if (!ayahData) return 0;

    let currentSegmentIndex = 0;
    let currentWordIndex = 0;

    for (let i = 0; i < ayahData.words.length; i++) {
      const word = ayahData.words[i];

      if (currentWordIndex === wordIndex - 1) {
        return currentSegmentIndex;
      }

      currentWordIndex++;

      // Check if word contains a semantic stop
      const hasSemanticStop = SEMANTIC_STOPS.some((stop) =>
        word.includes(stop)
      );

      if (hasSemanticStop || i === ayahData.words.length - 1) {
        currentSegmentIndex += 2; // Increment by 2 because of interleaved translation segments
      }
    }

    return currentSegmentIndex;
  }, [ayahsData]);

  // Enhanced current word with segment information
  const currentWordWithSegment = useMemo(() => {
    return currentWord
      ? {
          ...currentWord,
          segmentIndex: getWordSegmentIndex(
            currentWord.surah,
            currentWord.ayah,
            currentWord.wordIndex
          ),
        }
      : null;
  }, [currentWord, getWordSegmentIndex]);

  // Create flattened data structure for FlatList
  const flattenedData = useMemo(() => {
    return ayahsData.flatMap((ayah) =>
      splitVerseIntoSegments(ayah.words, ayah.surah, ayah.ayah)
    );
  }, [ayahsData, showTranslation, splitVerseIntoSegments]);

  // Scroll execution function
  const executeScroll = useCallback(
    (word: typeof currentWordWithSegment) => {
      if (word && flatListRef.current) {
        // Find the index of the segment containing the current word
        const segmentIndex = flattenedData.findIndex(
          (item) =>
            item.type === 'arabic' &&
            item.surah === word.surah &&
            item.ayah === word.ayah &&
            item.segmentIndex === word.segmentIndex
        );

        console.log('Scrolling to segment:', {
          currentWord: word,
          segmentIndex,
          totalSegments: flattenedData.length,
        });

        if (segmentIndex !== -1) {
          try {
            // Scroll to the segment containing the current word with offset for top 1/3
            flatListRef.current.scrollToIndex({
              index: segmentIndex,
              viewPosition: 0.33, // Position at top 1/3 of screen
              animated: true,
            });
          } catch (error) {
            // Fallback to scrollToOffset if scrollToIndex fails
            console.warn("ScrollToIndex failed, using scrollToOffset:", error);
            const estimatedOffset = segmentIndex * 80; // Rough estimate for segment height
            flatListRef.current.scrollToOffset({
              offset: estimatedOffset,
              animated: true,
            });
          }
        } else {
          console.warn('Segment not found for word:', word);
        }
      }
    },
    [flattenedData]
  );

  // Throttled scroll function
  const throttledScrollToWord = useCallback(
    (word: typeof currentWordWithSegment) => {
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
    if (currentWordWithSegment) {
      throttledScrollToWord(currentWordWithSegment);
    }
  }, [currentWordWithSegment, throttledScrollToWord]);

  const renderWord = (
    word: string,
    wordIndex: number,
    surah: number,
    ayah: number,
    segmentIndex?: number
  ) => {
    // Create word key for this specific word (wordIndex is 0-based, but audio data is 1-based)
    const wordKey = createWordKey(surah, ayah, wordIndex + 1);
    const isCurrentWord = currentWordKey === wordKey;

    // Check if this word should be highlighted (in current verse and before/at current word)
    const shouldHighlight =
      currentWordWithSegment &&
      currentWordWithSegment.surah === surah &&
      currentWordWithSegment.ayah === ayah &&
      wordIndex + 1 <= currentWordWithSegment.wordIndex &&
      (segmentIndex === undefined ||
        currentWordWithSegment.segmentIndex === segmentIndex);

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

  const onTranslationButtonPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    toggleTranslation();
  };

  return (
    <View style={[styles.container, style]}>
      <MaskedView
        style={styles.maskedContainer}
        maskElement={
          <View style={styles.maskContainer}>
            <LinearGradient
              colors={["transparent", "black"]}
              style={styles.topGradient}
            />
            <View style={styles.content} />
            <LinearGradient
              colors={["black", "transparent"]}
              style={styles.bottomGradient}
            />
          </View>
        }
      >
        <FlatList
          ref={flatListRef}
          contentContainerStyle={{ paddingRight: 30 }}
          data={flattenedData}
          keyExtractor={(item) =>
            `${item.type}-${item.surah}-${item.ayah}-${item.segmentIndex}`
          }
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
          style={styles.flatList}
          renderItem={({ item }) => {
            if (item.type === "arabic") {
              return (
                <TouchableOpacity onPress={() => handleVersePress(item.ayah)}>
                  <View style={styles.ayahContainer}>
                    {item.words.map((wordObj: any) =>
                      renderWord(
                        wordObj.word,
                        wordObj.wordIndex,
                        item.surah,
                        item.ayah,
                        item.segmentIndex
                      )
                    )}
                  </View>
                </TouchableOpacity>
              );
            } else if (item.type === "translation") {
              return (
                <View style={styles.translation}>
                  {item.words.map((translationWord: any, index: number) => {
                    // Calculate the corresponding Arabic word index for this translation word
                    const translationWordIndex = parseInt(translationWord.word_number);
                    
                    const isCurrentTranslationWord =
                      currentWordWithSegment?.ayah === item.ayah &&
                      currentWordWithSegment?.segmentIndex === item.segmentIndex - 1 &&
                      currentWordWithSegment?.wordIndex === translationWordIndex;

                    return (
                      <Text
                        key={`translation-${item.surah}-${item.ayah}-${item.segmentIndex}-${index}`}
                        style={[
                          styles.translationWord,
                          isCurrentTranslationWord && styles.currentWord,
                        ]}
                      >
                        {translationWord.text}
                      </Text>
                    );
                  })}
                </View>
              );
            }
            return null;
          }}
        />
      </MaskedView>

      <View
        style={[
          styles.translationButtonContainer,
          {
            opacity: showTranslation ? 1 : 0.7,
          },
        ]}
      >
        <TouchableOpacity onPress={onTranslationButtonPressed}>
          {showTranslation ? (
            <TranslationOnIcon width={30} height={30} />
          ) : (
            <TranslationOffIcon width={30} height={30} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ayahContainer: {
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  } as ViewStyle,
  container: {
    flexDirection: "row",
    paddingLeft: 30,
    flex: 1,
  } as ViewStyle,
  maskedContainer: {
    flex: 1,
  } as ViewStyle,
  maskContainer: {
    flex: 1,
    backgroundColor: "transparent",
  } as ViewStyle,
  topGradient: {
    height: 60,
  } as ViewStyle,
  content: {
    flex: 1,
    backgroundColor: "black",
  } as ViewStyle,
  bottomGradient: {
    height: 60,
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
    textShadowColor: "rgba(200,200,200,0.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  } as TextStyle,
  flatList: {
    paddingTop: 30,
  },
  translation: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    marginTop: 4,
    paddingLeft: 10,
    paddingRight: 40,
    justifyContent: "flex-start",
  } as ViewStyle,
  translationWord: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    fontFamily: "Inter",
    marginRight: 4,
    marginBottom: 2,
  } as TextStyle,
  translationButtonContainer: {
    position: "absolute",
    bottom: 10,
    left: 30,
    zIndex: 10,
  } as ViewStyle,
});

export default Mushaf;
