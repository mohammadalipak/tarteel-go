import * as Haptics from "expo-haptics";
import {
  Alert,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import CarIcon from "@/assets/images/car-icon.svg";
import PauseIcon from "@/assets/images/pause-icon.svg";
import PlayIcon from "@/assets/images/play-icon.svg";
import SkipBackwardIcon from "@/assets/images/skip-backward-icon.svg";
import SkipForwardIcon from "@/assets/images/skip-forward-icon.svg";
import { useAppStore } from "@/store/useAppStore";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const AudioControls: React.FC<ChildProps> = ({ style }) => {
  const { player, isPlaying } = useAudioPlayerContext();

  const onCarModePressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert("TODO: Switch to car mode");
  };

  const onPlayPausePressed = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View style={[style, styles.container]}>
      <View style={styles.left}>
        <TouchableOpacity onPress={onCarModePressed}>
          <CarIcon style={styles.carIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.leftMiddle}>
        <SkipBackwardIcon />
      </View>
      <View style={styles.middle}>
        <TouchableOpacity onPress={onPlayPausePressed}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </TouchableOpacity>
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
