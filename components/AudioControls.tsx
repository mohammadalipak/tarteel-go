import * as Haptics from "expo-haptics";
import {
  Alert,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import CarIcon from "@/assets/images/car-icon.svg";
import PauseIcon from "@/assets/images/pause-icon.svg";
import PlayIcon from "@/assets/images/play-icon.svg";
import SkipBackwardIcon from "@/assets/images/skip-backward-icon.svg";
import SkipForwardIcon from "@/assets/images/skip-forward-icon.svg";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { useAppStore } from "@/store/useAppStore";
import {
  findCurrentWord,
  findNextVerse,
  findPreviousVerse,
  getVerseStartTime,
} from "@/utils/audioWordMapping";
import BounceButton from "./BounceButton";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const AudioControls: React.FC<ChildProps> = ({ style }) => {
  const { player, isPlaying, currentTime } = useAudioPlayerContext();
  const {
    setShowRepetitionSettings,
    setShowSpeedSettings,
    playbackSpeed,
    startVerse,
    endVerse,
  } = useAppStore();

  const onCarModePressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("TODO: Switch to car mode");
  };

  const onPlayPausePressed = () => {
    try {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
        setShowRepetitionSettings(false);
      }
    } catch (error) {
      console.warn("Failed to toggle play/pause:", error);
    }
  };

  const onSkipForwardPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const currentWord = findCurrentWord(currentTime);
      if (currentWord && currentWord.ayah >= endVerse) {
        // Already at or past the end verse, don't skip forward
        console.log("Cannot skip forward: already at end verse", endVerse);
        return;
      }

      const nextVerseTime = findNextVerse(currentTime);
      if (nextVerseTime !== null && player.seekTo) {
        // Check if the next verse would be beyond our end verse
        const nextWord = findCurrentWord(nextVerseTime);
        if (nextWord && nextWord.ayah <= endVerse) {
          player.seekTo(nextVerseTime);
        } else {
          // Skip to the end verse if next would go beyond
          const endVerseTime = getVerseStartTime(endVerse);
          if (endVerseTime !== null) {
            player.seekTo(endVerseTime);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to skip forward:", error);
    }
  };

  const onSkipBackwardPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const currentWord = findCurrentWord(currentTime);
      if (currentWord && currentWord.ayah < startVerse) {
        // Already before the start verse, seek to start verse
        console.log("Before start verse, seeking to start verse", startVerse);
        const startVerseTime = getVerseStartTime(startVerse);
        if (startVerseTime !== null && player.seekTo) {
          player.seekTo(startVerseTime);
        }
        return;
      }

      const previousVerseTime = findPreviousVerse(currentTime);
      if (previousVerseTime !== null && player.seekTo) {
        // Check if the previous verse would be before our start verse
        const previousWord = findCurrentWord(previousVerseTime);
        if (previousWord && previousWord.ayah >= startVerse) {
          player.seekTo(previousVerseTime);
        } else {
          // Skip to the start verse if previous would go before
          const startVerseTime = getVerseStartTime(startVerse);
          if (startVerseTime !== null) {
            player.seekTo(startVerseTime);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to skip backward:", error);
    }
  };

  const onSpeedPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSpeedSettings(true);
  };

  return (
    <View style={[style, styles.container]}>
      <View style={styles.left}>
        <BounceButton scale={1} onPress={onSpeedPressed}>
          <Text style={styles.speedButton}>{`${playbackSpeed}x`}</Text>
        </BounceButton>
      </View>
      <View style={styles.leftMiddle}>
        <BounceButton onPress={onSkipBackwardPressed} style={styles.button}>
          <SkipBackwardIcon />
        </BounceButton>
      </View>
      <View style={styles.middle}>
        <BounceButton
          onPress={onPlayPausePressed}
          scale={0.1}
          style={styles.button}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </BounceButton>
      </View>
      <View style={styles.rightMiddle}>
        <BounceButton onPress={onSkipForwardPressed} style={styles.button}>
          <SkipForwardIcon />
        </BounceButton>
      </View>
      <View style={styles.right}>
        <BounceButton onPress={onCarModePressed}>
          <CarIcon style={styles.carIcon} />
        </BounceButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 20,
  },
  carIcon: {
    opacity: 0.6,
    width: 50,
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
  right: {
    width: 50,
    alignItems: "flex-end",
  },
  speedButton: {
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: "SFProRoundedBold",
    paddingVertical: 20,
    width: 50,
  },
});

export default AudioControls;
