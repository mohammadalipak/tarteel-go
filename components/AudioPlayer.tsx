import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { useAppStore } from "@/store/useAppStore";
import AudioControls from "./AudioControls";
import SeekBar from "./SeekBar";
import SpeedSettings from "./SpeedSettings";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const AudioPlayer: React.FC<ChildProps> = ({ style }) => {
  const { showSpeedSettings } = useAppStore();

  return (
    <View style={[styles.container, style]}>
      <SeekBar style={styles.seekBar}></SeekBar>
      {showSpeedSettings ? (
        <SpeedSettings style={styles.body}></SpeedSettings>
      ) : (
        <AudioControls style={styles.body}></AudioControls>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginTop: 20,
    width: "100%",
  },
  container: {
    marginBottom: 50,
  },
  seekBar: {
    flex: 1,
    width: "100%",
  },
});

export default AudioPlayer;
