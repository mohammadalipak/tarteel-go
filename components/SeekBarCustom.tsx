import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CustomSeekbar() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [duration, setDuration] = useState(1); // avoid div-by-zero
  const [position, setPosition] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const isSliding = useRef(false);

  useEffect(() => {
    (async () => {
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(sound);
    })();

    return () => {
      sound?.unloadAsync();
    };
  }, []);

  const onPlaybackStatusUpdate = (
    status: Audio.AVPlaybackStatusSuccess | Audio.AVPlaybackStatusError
  ) => {
    if (!status.isLoaded) return;

    if (!isSliding.current) {
      setDuration(status.durationMillis ?? 1);
      setPosition(status.positionMillis);
      progress.setValue(
        (status.positionMillis ?? 0) / (status.durationMillis ?? 1)
      );
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isSliding.current = true;
      },
      onPanResponderMove: (_, gesture) => {
        const x = Math.min(
          Math.max(0, gesture.dx + progress.__getValue() * barWidth),
          barWidth
        );
        const newProgress = x / barWidth;
        progress.setValue(newProgress);
      },
      onPanResponderRelease: async (_, gesture) => {
        isSliding.current = false;
        const x = Math.min(
          Math.max(0, gesture.dx + progress.__getValue() * barWidth),
          barWidth
        );
        const newProgress = x / barWidth;
        const newPosition = newProgress * duration;
        setPosition(newPosition);
        await sound?.setPositionAsync(newPosition);
      },
    })
  ).current;

  const handleLayout = (e: LayoutChangeEvent) => {
    setBarWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <Text>{formatTime(position)}</Text>
        <Text>{formatTime(duration)}</Text>
      </View>
      <View style={styles.barContainer} onLayout={handleLayout}>
        <View style={styles.track} />
        <Animated.View
          style={[
            styles.progress,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, barWidth],
                extrapolate: "clamp",
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.thumb,
            {
              left: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, barWidth - 10],
                extrapolate: "clamp",
              }),
            },
          ]}
          {...panResponder.panHandlers}
        />
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
  container: {
    padding: 16,
    width: "100%",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  barContainer: {
    height: 30,
    justifyContent: "center",
  },
  track: {
    height: 6,
    backgroundColor: "#ccc",
    borderRadius: 3,
  },
  progress: {
    position: "absolute",
    height: 6,
    backgroundColor: "#007bff",
    borderRadius: 3,
  },
  thumb: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "#007bff",
    borderRadius: 10,
    top: -7,
  },
});
