import Slider from "@react-native-community/slider";
import { Audio, AVPlaybackStatus } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const AUDIO_URL =
  "https://download.quranicaudio.com/qdc/abdurrahmaan_as_sudais/murattal/73.mp3";

export default function AudioSeekbar({ style }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const isSliding = useRef(false);

  // Load and play audio
  useEffect(() => {
    (async () => {
      const { sound } = await Audio.Sound.createAsync(
        { uri: AUDIO_URL },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(sound);
    })();

    return () => {
      sound?.unloadAsync();
    };
  }, []);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      console.warn("Audio not loaded:", status.error);
      return;
    }
    if (
      !isSliding.current &&
      status.isLoaded &&
      status.positionMillis !== undefined
    ) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis ?? 0);
    }
  };

  const handleSlidingStart = () => {
    isSliding.current = true;
  };

  const handleSlidingComplete = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
    isSliding.current = false;
  };

  return (
    <View style={[style, styles.container]}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingStart={handleSlidingStart}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor="#ffffff7e"
        maximumTrackTintColor="#ffffff40"
        thumbTintColor="transparent"
      />
      <View style={styles.footer}>
        <Text style={styles.leftLabel}>{formatTime(position)}</Text>
        <Text style={styles.middleLabel}>AbdurRahman AsSudais</Text>
        <Text style={styles.rightLabel}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
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
    color: "rgba(255, 255, 255, 0.5)",
    flex: 1,
    textAlign: "center",
  },
});
