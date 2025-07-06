import { Fragment } from "react";
import {
  FlatList,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
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
        contentContainerStyle={{ paddingRight: 30 }}
        data={getAyahs(Words)}
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
  },
  container: { flexDirection: "row", paddingLeft: 30 },
  word: {
    color: "rgba(255,255,255,0.1)",
    fontSize: 30,
    fontFamily: "UthmanicHafs",
    marginLeft: 2,
    writingDirection: "rtl",
  },
  highlightedWord: {
    color: "rgba(255,255,255,0.7)",
  },
  currentWord: {
    color: "#ffffff",
    textShadowColor: "rgba(200,200,200,.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default Mushaf;
