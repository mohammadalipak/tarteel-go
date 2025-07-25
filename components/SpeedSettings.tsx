import { useAppStore } from "@/store/useAppStore";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import SettingsSlider from "./SettingsSlider";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const SpeedSettings: React.FC<ChildProps> = ({ style }) => {
  const { playbackSpeed, setPlaybackSpeed, setShowSpeedSettings } =
    useAppStore();

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const onButtonPressed = () => {
    setShowSpeedSettings(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={onButtonPressed}
        style={styles.buttonContainer}
      >
        <Text style={styles.button}>{`${playbackSpeed}x`}</Text>
      </TouchableOpacity>

      <SettingsSlider
        minValue={0.5}
        maxValue={2.0}
        markerStep={0.5}
        valueStep={0.1}
        value={playbackSpeed}
        onValueChange={handleSpeedChange}
        style={styles.slider}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
  buttonContainer: {
    width: 50,
    alignItems: "flex-start",
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 7,
    padding: 6,
    left: -6,
    color: "#088581",
    fontFamily: "SFProRoundedBold",
  },
  slider: {
    flex: 1,
    // marginTop: 20,
  },
});

export default SpeedSettings;
