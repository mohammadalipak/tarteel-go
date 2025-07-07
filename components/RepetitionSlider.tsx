import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface RepetitionSliderProps {
  style?: StyleProp<ViewStyle>;
  minValue: number;
  maxValue: number;
  markers: number[];
  valueStep: number;
  value: number;
  onValueChange: (value: number) => void;
}

export default function RepetitionSlider({
  markers,
  maxValue,
  minValue,
  onValueChange,
  valueStep,
  style,
  value,
}: RepetitionSliderProps) {
  const [sliderValue, setSliderValue] = useState(0);
  const isSliding = useRef(false);
  const lastStepValueRef = useRef<number | null>(null);

  const handleSlidingStart = () => {
    isSliding.current = true;
    // Initialize with current value when sliding starts
    lastStepValueRef.current = Number(value.toFixed(1));
  };

  const handleValueChange = async (value: number) => {
    const roundedValue = Math.round(value);

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

  // Calculate effective max value (add infinity step)
  const effectiveMaxValue = maxValue + valueStep;

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
        maximumValue={effectiveMaxValue}
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
        {markers.map((marker) => {
          // Calculate the position of each marker along the slider track
          const markerValue = marker === Infinity ? effectiveMaxValue : marker;
          const position =
            ((markerValue - minValue) / (effectiveMaxValue - minValue)) * 100;

          return (
            <View
              key={marker}
              style={[
                styles.marker,
                {
                  left: marker == 15 ? `${position - 5}%` : `${position}%`,
                  marginLeft: position === 0 ? 0 : -12, // Adjust for edge cases
                  marginRight: position === 100 ? 0 : -12,
                },
              ]}
            >
              <Text style={styles.markerText}>
                {marker === Infinity ? "∞" : `${marker}x`}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  footer: {
    position: "relative",
    height: 20,
    marginTop: 5,
  },
  slider: {
    height: 10,
  },
  marker: {
    position: "absolute",
    alignItems: "center",
    minWidth: 24, // Ensure minimum width for visibility
  },
  markerText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: "SFProRoundedBold",
    fontSize: 12,
    textAlign: "center",
  },
});
