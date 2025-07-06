import * as Haptics from "expo-haptics";
import { Alert, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import AudioControls from "./AudioControls";
import SeekBar from "./SeekBar";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const AudioPlayer: React.FC<ChildProps> = ({ style }) => {
  const handlePress = () => {
    Haptics.selectionAsync();
    Alert.alert("Image button pressed!");
  };

  return (
    <View style={[styles.container, style]}>
      <SeekBar style={styles.seekBar}></SeekBar>
      <AudioControls style={styles.audioControls}></AudioControls>
    </View>
  );
};

const styles = StyleSheet.create({
  audioControls: {
    flex: 1,
    marginTop: 20,
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
