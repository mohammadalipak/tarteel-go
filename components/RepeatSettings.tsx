import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import RepetitionSlider from "./RepetitionSlider";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const RepeatSettings: React.FC<ChildProps> = ({ style }) => {
  return (
    <View style={[style, styles.container]}>
      <View style={styles.verseSettings}>
        <Text style={styles.title}>Verse Repetition</Text>

        <RepetitionSlider></RepetitionSlider>
      </View>

      <View style={styles.sectionSettings}>
        <Text style={styles.title}>Section Repetition</Text>

        <View style={styles.sectionSelector}>
          <Text style={styles.label}>Start</Text>
          <Text style={styles.selection}>Al-Muzzammil 7</Text>
        </View>
        <View style={styles.sectionSelector}>
          <Text style={styles.label}>End</Text>
          <Text style={styles.selection}>Al-Muzzammil 20</Text>
        </View>

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

export default RepeatSettings;
