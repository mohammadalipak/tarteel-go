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
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { findNextVerse, findPreviousVerse } from "@/utils/audioWordMapping";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const AudioControls: React.FC<ChildProps> = ({ style }) => {
  const { player, isPlaying, currentTime } = useAudioPlayerContext();

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

  const onSkipForwardPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const nextVerseTime = findNextVerse(currentTime);
    if (nextVerseTime !== null && player.seekTo) {
      player.seekTo(nextVerseTime);
    }
  };

  const onSkipBackwardPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const previousVerseTime = findPreviousVerse(currentTime);
    if (previousVerseTime !== null && player.seekTo) {
      player.seekTo(previousVerseTime);
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
        <TouchableOpacity onPress={onSkipBackwardPressed} style={styles.button}>
          <SkipBackwardIcon />
        </TouchableOpacity>
      </View>
      <View style={styles.middle}>
        <TouchableOpacity onPress={onPlayPausePressed} style={styles.button}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </TouchableOpacity>
      </View>
      <View style={styles.rightMiddle}>
        <TouchableOpacity onPress={onSkipForwardPressed} style={styles.button}>
          <SkipForwardIcon />
        </TouchableOpacity>
      </View>
      <View style={styles.right}>
        <Text style={styles.speedButton}>1.5x</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 20,
  },
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
