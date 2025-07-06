import { Fragment } from "react";
import {
  FlatList,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import Words from "@/assets/data/text_quran.json";
import { getAyahs } from "../helpers";
import BoldableWord from "./BoldableWord";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const Mushaf: React.FC<ChildProps> = ({ style }) => {
  const renderWord = (
    word: string,
    wordIndex: number,
    startingAyahKey: string
  ) => {
    // const isCurrentAyah = currentAyah === startingAyahKey;
    // const isHighlighted = isCurrentAyah && highlightedWord === wordIndex;
    // const isPlayed =
    //   isCurrentAyah && wordIndex < highlightedWord && highlightedWord > -1;
    // const isNextWord = isCurrentAyah && highlightedWord === wordIndex - 1;

    // // Check if word ends with semantic stop character
    // const endsWithSemanticStop = SEMANTIC_STOPS.some((stop) =>
    //   word.endsWith(stop)
    // );

    return (
      <Fragment key={`word-fragment-${startingAyahKey}-${wordIndex}`}>
        <Text
          style={[
            styles.word,
            // isHighlighted && styles.highlightedWord,
            // isPlayed && styles.playedWord,
            // isNextWord && styles.nextWord,
          ]}
        >
          <BoldableWord bold style={styles.word} text={word}></BoldableWord>
        </Text>
        {/* {endsWithSemanticStop && <Text style={styles.lineBreak}>{"\n"}</Text>} */}
      </Fragment>
    );
  };

  return (
    <View style={[styles.mushaf, style]}>
      <FlatList
        data={getAyahs(Words)}
        renderItem={({ item }) => {
          const startingAyahKey = `${item.surah}-${item.ayah}`;
          return (
            <TouchableOpacity>
              <View style={styles.ayahContainer}>
                {item.words.map((word: string, index: number) =>
                  renderWord(word, index, startingAyahKey)
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
  mushaf: { flexDirection: "row" },
  word: {
    color: "rgba(255,255,255,1)",
    fontSize: 30,
    fontFamily: "UthmanicHafs",
    marginLeft: 2,
    writingDirection: "rtl",
  },
});

export default Mushaf;
