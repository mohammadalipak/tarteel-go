import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import CarIcon from "@/assets/images/car-icon.svg";
// import PauseIcon from "@/assets/images/pause-icon.svg";
import PlayIcon from "@/assets/images/play-icon.svg";
import SkipBackwardIcon from "@/assets/images/skip-backward-icon.svg";
import SkipForwardIcon from "@/assets/images/skip-forward-icon.svg";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const AudioControls: React.FC<ChildProps> = ({ style }) => {
  return (
    <View style={[style, styles.container]}>
      <View style={styles.left}>
        <CarIcon style={styles.carIcon} />
      </View>
      <View style={styles.leftMiddle}>
        <SkipBackwardIcon />
      </View>
      <View style={styles.middle}>
        <PlayIcon />
      </View>
      <View style={styles.rightMiddle}>
        <SkipForwardIcon />
      </View>
      <View style={styles.right}>
        <Text style={styles.speedButton}>1.5x</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carIcon: {
    opacity: 0.5,
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
  left: {},
  leftMiddle: {
    alignItems: "center",
    flex: 1,
  },
  middle: {
    alignItems: "center",
    flex: 1,
  },
  rightMiddle: {
    alignItems: "center",
    flex: 1,
  },
  right: {},
  speedButton: {
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: "SFProRoundedBold",
  },
});

export default AudioControls;
