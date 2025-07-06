import * as Haptics from "expo-haptics";
import {
  Alert,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import RepeatIcon from "@/assets/images/repeat-icon.svg";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
  onToggleRepeatSettings?: () => void;
  showRepeatSettings?: boolean;
};

const Header: React.FC<ChildProps> = ({
  style,
  onToggleRepeatSettings,
  showRepeatSettings,
}) => {
  const onSurahPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert("TODO: Open surah navigation");
  };

  const onRepeatPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (onToggleRepeatSettings) {
      onToggleRepeatSettings();
    }
  };

  return (
    <View style={[styles.header, style]}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={onSurahPressed}>
          <Text style={styles.title}>Al-Muzzammil - 3</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>
          Repeating verse 3x, Looping section forever
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Pressable onPress={onRepeatPressed}>
          <View
            style={[
              styles.repeatButtonContainer,
              {
                backgroundColor: showRepeatSettings
                  ? "rgba(255, 255, 255, 0.5)"
                  : "transparent",
              },
            ]}
          >
            <RepeatIcon
              fill={showRepeatSettings ? "#088581" : "#fff"}
              style={[
                styles.repeatButton,
                { opacity: showRepeatSettings ? 1 : 0.7 },
              ]}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: "row" },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  repeatButton: {
    opacity: 0.7,
  },
  repeatButtonContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 7,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 13,
    marginTop: 5,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
  },
});

export default Header;
