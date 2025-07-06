import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { useAppStore } from "@/store/useAppStore";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AudioSeekbar({ style }) {
  const { audioDuration, currentAudioTime } = useAppStore();
  const { player } = useAudioPlayerContext();
  const [sliderValue, setSliderValue] = useState(0);
  const isSliding = useRef(false);

  const handleSlidingStart = () => {
    isSliding.current = true;
  };

  const handleValueChange = (value: number) => {
    if (isSliding.current) {
      setSliderValue(value);
    }
  };

  const handleSlidingComplete = async (value: number) => {
    if (player && player.seekTo) {
      await player.seekTo(value);
    }
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
                scaleY: isSliding.current ? 2 : 1,
              },
            ],
          },
        ]}
        minimumValue={0}
        maximumValue={audioDuration}
        value={isSliding.current ? sliderValue : currentAudioTime}
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
          {formatTime(isSliding.current ? sliderValue : currentAudioTime)}
        </Text>
        <TouchableOpacity onPress={onQariPressed} style={styles.middleLabel}>
          <Text style={styles.qari}>AbdurRahman AsSudais</Text>
        </TouchableOpacity>
        <Text style={styles.rightLabel}>
          {`-${formatTime(
            audioDuration - (isSliding.current ? sliderValue : currentAudioTime)
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
    marginTop: 5,
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
