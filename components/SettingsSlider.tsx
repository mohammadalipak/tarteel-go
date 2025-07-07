import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface SettingsSliderProps {
  style?: StyleProp<ViewStyle>;
  minValue: number;
  maxValue: number;
  markerStep: number;
  valueStep: number;
  value: number;
  onValueChange: (value: number) => void;
}

export default function SettingsSlider({
  markerStep,
  maxValue,
  minValue,
  onValueChange,
  valueStep,
  style,
  value,
}: SettingsSliderProps) {
  const [sliderValue, setSliderValue] = useState(0);
  const isSliding = useRef(false);
  const lastStepValueRef = useRef<number | null>(null);

  const handleSlidingStart = () => {
    isSliding.current = true;
    // Initialize with current value when sliding starts
    lastStepValueRef.current = Number(value.toFixed(1));
  };

  const handleValueChange = async (value: number) => {
    const roundedValue = Number(value.toFixed(1));

    // Check if we've moved to a different step and provide haptic feedback
    if (
      isSliding.current &&
      lastStepValueRef.current !== null &&
      roundedValue !== lastStepValueRef.current
    ) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      lastStepValueRef.current = roundedValue;
    }

    setSliderValue(roundedValue);
    onValueChange(roundedValue);
  };

  const handleSlidingComplete = () => {
    isSliding.current = false;
    setSliderValue(0);
    // Reset step tracking when sliding completes
    lastStepValueRef.current = null;
  };

  // Generate marker values
  const markers = [];
  for (let i = minValue; i <= maxValue; i += markerStep) {
    markers.push(i);
  }

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
        minimumValue={minValue}
        maximumValue={maxValue}
        step={valueStep}
        value={isSliding.current ? sliderValue : value}
        onSlidingStart={handleSlidingStart}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor={isSliding.current ? "#ffffff" : "#ffffff7e"}
        maximumTrackTintColor="#ffffff20"
        thumbTintColor="transparent"
        tapToSeek
      />
      <View style={styles.footer}>
        {markers.map((markerValue) => (
          <View key={markerValue} style={styles.marker}>
            <Text style={styles.markerText}>{`${markerValue}x`}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  footer: {
    flexDirection: "row",
    marginTop: 5,
    justifyContent: "space-between",
  },
  slider: {
    height: 10,
  },
  marker: {
    alignItems: "center",
  },
  markerText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: "SFProRoundedBold",
    fontSize: 12,
  },
});
