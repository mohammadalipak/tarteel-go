import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
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
  const {
    sectionRepetition,
    showRepetitionSettings,
    toggleRepetitionSettings,
    verseRepetition,
  } = useAppStore();
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

  const getRepetitionMessage = () => {
    let message = "";

    if (verseRepetition > 1) {
      message += verseRepetition <= 15 ? `${verseRepetition}x` : "Loop";
      message += " each verse";
    }

    if (sectionRepetition > 1) {
      if (message !== "") {
        message += " · ";
      }

      message += sectionRepetition <= 15 ? `${sectionRepetition}x` : "Loop";
      message += " entire section";
    }

    return message || "Continuous Play";
  };

  return (
    <View style={[styles.header, style]}>
      <View style={styles.leftContainer}>
        <View>
          <TouchableOpacity onPress={onSurahPressed}>
            <Image
              source={require("@/assets/images/muzzammil.png")}
              style={{ width: 65, height: 65 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={onSurahPressed}>
            <Text style={styles.title}>Al-Muzzammil : {displayedVerse}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onRepeatPressed}>
            <Text style={styles.subtitle}>{getRepetitionMessage()}</Text>
          </TouchableOpacity>
        </View>
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
                {
                  opacity:
                    showRepetitionSettings ||
                    verseRepetition > 1 ||
                    sectionRepetition > 1
                      ? 1
                      : 0.7,
                },
              ]}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
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
    top: -10,
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
  titleContainer: {
    marginLeft: 10,
  },
});

export default Header;
