import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
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
  const [sliderValue, setSliderValue] = useState(0);
  const isSliding = useRef(false);

  const handleSlidingStart = () => {
    isSliding.current = true;
  };

  const handleValueChange = async (value: number) => {
    if (isSliding.current) {
      setSliderValue(value);

      if (player && player.seekTo) {
        await player.seekTo(value);
      }
    }
  };

  const handleSlidingComplete = async (value: number) => {
    isSliding.current = false;
    setSliderValue(0);
  };

  const onQariPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert("TODO: Show Qari switcher");
  };

  return (
    <View style={[style, styles.container]}>
      <Slider
        style={[
          styles.slider,
          {
            transform: [
              {
                scaleY: isSliding.current ? 3 : 1.5,
              },
            ],
          },
        ]}
        minimumValue={0}
        maximumValue={duration}
        value={isSliding.current ? sliderValue : currentTime}
        onSlidingStart={handleSlidingStart}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor={isSliding.current ? "#ffffff" : "#ffffff7e"}
        maximumTrackTintColor="#ffffff20"
        thumbTintColor="transparent"
        tapToSeek
      />
      <View style={styles.footer}>
        <Text style={styles.leftLabel}>
          {formatTime(isSliding.current ? sliderValue : currentTime)}
        </Text>
        <TouchableOpacity onPress={onQariPressed} style={styles.middleLabel}>
          <Text style={styles.qari}>AbdurRahman AsSudais</Text>
        </TouchableOpacity>
        <Text style={styles.rightLabel}>
          {`-${formatTime(
            duration - (isSliding.current ? sliderValue : currentTime)
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
