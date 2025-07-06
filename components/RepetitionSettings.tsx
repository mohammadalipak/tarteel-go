import {
  Alert,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { useAppStore } from "@/store/useAppStore";
import RepetitionSlider from "./RepetitionSlider";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const RepetitionSettings: React.FC<ChildProps> = ({ style }) => {
  const { startVerse, endVerse, setStartVerse, setEndVerse } = useAppStore();
  const verseNumbers = Array.from({ length: 20 }, (_, i) => i + 1);
  const verseOptions = verseNumbers.map((num) => `Al-Muzzammil ${num}`);

  const showContextMenu = (isStartVerse: boolean) => {
    const currentVerse = isStartVerse ? startVerse : endVerse;
    const callback = isStartVerse ? setStartVerse : setEndVerse;

    let availableOptions;
    if (isStartVerse) {
      // For start verse, show all options
      availableOptions = verseNumbers;
    } else {
      // For end verse, only show verses after the start verse
      availableOptions = verseNumbers.filter((num) => num >= startVerse);
    }

    Alert.alert(
      `Select ${isStartVerse ? "Start" : "End"} Verse`,
      `Current: Al-Muzzammil ${currentVerse}`,
      [
        ...availableOptions.map((num) => ({
          text: `Al-Muzzammil ${num}`,
          onPress: () => callback(num),
        })),
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <View style={[style, styles.container]}>
      <View style={styles.verseSettings}>
        <Text style={styles.title}>Verse Repetition</Text>

        <RepetitionSlider></RepetitionSlider>
      </View>

      <View style={styles.sectionSettings}>
        <Text style={styles.title}>Section Repetition</Text>

        <TouchableOpacity
          style={styles.sectionSelector}
          onPress={() => showContextMenu(true)}
        >
          <Text style={styles.label}>Start</Text>
          <Text style={styles.selection}>Al-Muzzammil {startVerse}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sectionSelector}
          onPress={() => showContextMenu(false)}
        >
          <Text style={styles.label}>End</Text>
          <Text style={styles.selection}>Al-Muzzammil {endVerse}</Text>
        </TouchableOpacity>

        <RepetitionSlider></RepetitionSlider>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
  },
  label: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "SFProRoundedBold",
    fontSize: 20,
    width: 70,
  },
  title: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 30,
    fontWeight: 600,
    marginBottom: 20,
  },
  sectionSelector: {
    flexDirection: "row",
    marginBottom: 20,
  },
  sectionSettings: {
    marginTop: 50,
  },
  selection: {
    color: "#fff",
    fontFamily: "SFProRoundedBold",
    fontSize: 20,
  },
  verseSettings: {
    marginTop: 40,
  },
});

export default RepetitionSettings;
