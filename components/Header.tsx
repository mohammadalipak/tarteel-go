import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
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
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { useAppStore } from "@/store/useAppStore";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const Header: React.FC<ChildProps> = ({ style }) => {
  const { showRepetitionSettings, toggleRepetitionSettings } = useAppStore();
  const { currentWord } = useAudioPlayerContext();
  const [displayedVerse, setDisplayedVerse] = useState(1);

  // Update displayed verse only when we have a valid current word
  useEffect(() => {
    if (currentWord?.ayah) {
      setDisplayedVerse(currentWord.ayah);
    }
  }, [currentWord?.ayah]);

  const onSurahPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("TODO: Open surah navigation");
  };

  const onRepeatPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleRepetitionSettings();
  };

  return (
    <View style={[styles.header, style]}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={onSurahPressed}>
          <Text style={styles.title}>Al-Muzzammil : {displayedVerse}</Text>
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
                backgroundColor: showRepetitionSettings
                  ? "rgba(255, 255, 255, 0.5)"
                  : "transparent",
              },
            ]}
          >
            <RepeatIcon
              fill={showRepetitionSettings ? "#088581" : "#fff"}
              style={[
                styles.repeatButton,
                { opacity: showRepetitionSettings ? 1 : 0.7 },
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
