import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

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
    <View style={styles.container}>
      <CarIcon style={styles.left}></CarIcon>
      <SkipBackwardIcon style={styles.leftMiddle}></SkipBackwardIcon>
      <PlayIcon style={styles.middle}></PlayIcon>
      <SkipForwardIcon style={styles.rightMiddle}></SkipForwardIcon>
      <View style={styles.right}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "blue",
  },
  left: {
    flex: 1,
  },
  leftMiddle: {
    flex: 1,
    backgroundColor: "red",
  },
});

export default AudioControls;
