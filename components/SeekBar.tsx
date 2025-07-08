import { QariName } from "@/constants/QariNames";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { useAppStore } from "@/store/useAppStore";
import {
  findCurrentWord,
  getVerseEndTime,
  getVerseStartTime,
} from "@/utils/audioWordMapping";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import BouncySlider from "./BouncySlider";
import {
  Alert,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface AudioSeekbarProps {
  style?: StyleProp<ViewStyle>;
}

export default function AudioSeekbar({ style }: AudioSeekbarProps) {
  const { player, currentTime, duration } = useAudioPlayerContext();
  const { startVerse, endVerse } = useAppStore();
  const [sliderValue, setSliderValue] = useState(0);
  const isSliding = useRef(false);
  const lastVerseRef = useRef<number | null>(null);

  // Calculate verse range limits
  const verseRangeStart = getVerseStartTime(startVerse) || 0;
  const verseRangeEnd = getVerseEndTime(endVerse) || duration;
  const verseRangeDuration = verseRangeEnd - verseRangeStart;

  const handleSlidingStart = () => {
    isSliding.current = true;
    // Initialize with current verse when sliding starts
    const currentWord = findCurrentWord(currentTime);
    lastVerseRef.current = currentWord?.ayah || null;
  };

  const handleValueChange = async (value: number) => {
    if (isSliding.current) {
      // Map slider value (0-1) to actual time range within verse bounds
      const actualTime = verseRangeStart + value * verseRangeDuration;
      setSliderValue(value);

      // Find the current word at this position
      const currentWord = findCurrentWord(actualTime);
      const currentVerse = currentWord?.ayah;

      // Check if verse has changed and provide haptic feedback
      if (
        currentVerse &&
        lastVerseRef.current &&
        currentVerse !== lastVerseRef.current
      ) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        lastVerseRef.current = currentVerse;
      } else if (currentVerse && !lastVerseRef.current) {
        // First time finding a verse
        lastVerseRef.current = currentVerse;
      }

      if (player && player.seekTo) {
        await player.seekTo(actualTime);
      }
    }
  };

  const handleSlidingComplete = async () => {
    isSliding.current = false;
    setSliderValue(0);
    // Reset verse tracking when sliding completes
    lastVerseRef.current = null;
  };

  const onQariPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert("TODO: Show Qari switcher");
  };

  return (
    <View style={[style, styles.container]}>
      <BouncySlider isActive={isSliding.current}>
        <Slider
          style={[styles.slider]}
          minimumValue={0}
          maximumValue={1}
          value={
            isSliding.current
              ? sliderValue
              : Math.max(
                  0,
                  Math.min(
                    1,
                    (currentTime - verseRangeStart) / verseRangeDuration
                  )
                )
          }
          onSlidingStart={handleSlidingStart}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor={isSliding.current ? "#ffffff" : "#ffffff7e"}
          maximumTrackTintColor="#ffffff20"
          thumbTintColor="transparent"
          tapToSeek
        />
      </BouncySlider>
      <View style={styles.footer}>
        <Text style={styles.leftLabel}>
          {formatTime(
            isSliding.current
              ? sliderValue * verseRangeDuration
              : currentTime - verseRangeStart
          )}
        </Text>

        <TouchableOpacity onPress={onQariPressed} style={styles.middleLabel}>
          <Text style={styles.qari}>{QariName.MISHARY}</Text>
        </TouchableOpacity>

        <Text style={styles.rightLabel}>
          {`-${formatTime(
            verseRangeEnd -
              (isSliding.current
                ? verseRangeStart + sliderValue * verseRangeDuration
                : currentTime)
          )}`}
        </Text>
      </View>
    </View>
  );
}

function formatTime(totalSec: number) {
  const min = Math.floor(totalSec / 60);
  const sec = Math.floor(totalSec % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

const styles = StyleSheet.create({
  container: {},
  footer: {
    flexDirection: "row",
    marginTop: 10,
  },
  slider: {
    height: 10,
  },
  leftLabel: {
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: "SFProRoundedBold",
    minWidth: 50,
    textAlign: "left",
  },
  rightLabel: {
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: "SFProRoundedBold",
    minWidth: 50,
    textAlign: "right",
  },
  middleLabel: {
    flex: 1,
  },
  qari: {
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
});
