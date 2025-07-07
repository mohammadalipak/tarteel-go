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

const SECTION_REPETITION_CONFIG = {
  maxSetting: 15,
  minSetting: 1,
};
const VERSE_REPETITION_CONFIG = {
  maxSetting: 15,
  minSetting: 1,
};

const RepetitionSettings: React.FC<ChildProps> = ({ style }) => {
  const {
    startVerse,
    endVerse,
    sectionRepetition,
    setStartVerse,
    setEndVerse,
    setSectionRepetition,
    setVerseRepetition,
    verseRepetition,
  } = useAppStore();
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

  const onSectionRepetitionChanged = (value: number) => {
    if (value <= SECTION_REPETITION_CONFIG.maxSetting) {
      setSectionRepetition(value);
    } else {
      // Only set to 10000 (infinity) when value is beyond maxSetting
      setSectionRepetition(10000);
    }
  };

  const onVerseRepetitionChanged = (value: number) => {
    if (value <= VERSE_REPETITION_CONFIG.maxSetting) {
      setVerseRepetition(value);
    } else {
      // Only set to 10000 (infinity) when value is beyond maxSetting
      setVerseRepetition(10000);
    }
  };

  return (
    <View style={[style, styles.container]}>
      <View style={styles.verseSettings}>
        <View style={styles.settingsHeader}>
          <Text style={styles.title}>Verse Repetition</Text>
          <Text style={styles.settingsValue}>
            {verseRepetition <= VERSE_REPETITION_CONFIG.maxSetting
              ? `${verseRepetition}x`
              : "∞"}
          </Text>
        </View>

        <RepetitionSlider
          minValue={VERSE_REPETITION_CONFIG.minSetting}
          maxValue={VERSE_REPETITION_CONFIG.maxSetting}
          markers={[1, 5, 10, 15, Infinity]}
          valueStep={1}
          value={verseRepetition}
          onValueChange={onVerseRepetitionChanged}
        />
      </View>

      <View style={styles.sectionSettings}>
        <View style={styles.settingsHeader}>
          <Text style={styles.title}>Section Repetition</Text>
          <Text style={styles.settingsValue}>
            {sectionRepetition <= SECTION_REPETITION_CONFIG.maxSetting
              ? `${sectionRepetition}x`
              : "∞"}
          </Text>
        </View>

        <RepetitionSlider
          minValue={SECTION_REPETITION_CONFIG.minSetting}
          maxValue={SECTION_REPETITION_CONFIG.maxSetting}
          markers={[1, 5, 10, 15, Infinity]}
          valueStep={1}
          value={sectionRepetition}
          onValueChange={onSectionRepetitionChanged}
          style={styles.sectionSlider}
        />

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
  },
  sectionSelector: {
    flexDirection: "row",
    marginBottom: 20,
  },
  sectionSettings: {
    marginTop: 80,
  },
  sectionSlider: {
    marginBottom: 40,
  },
  selection: {
    color: "#fff",
    fontFamily: "SFProRoundedBold",
    fontSize: 20,
  },
  verseSettings: {
    marginTop: 40,
  },
  settingsHeader: {
    flexDirection: "row",
    marginBottom: 30,
  },
  settingsValue: {
    color: "#fff",
    fontSize: 30,
    fontWeight: 600,
    marginLeft: 10,
  },
});

export default RepetitionSettings;
