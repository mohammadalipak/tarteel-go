import * as Haptics from "expo-haptics";
import {
  Alert,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import RepeatIcon from "@/assets/images/repeat-icon.svg";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const Header: React.FC<ChildProps> = ({ style }) => {
  const handlePress = () => {
    Haptics.selectionAsync();
    Alert.alert("Image button pressed!");
  };

  return (
    <View style={[styles.header, style]}>
      <View style={styles.leftContainer}>
        <Text style={styles.title}>Al-Muzzammil - 3</Text>
        <Text style={styles.subtitle}>
          Repeating verse 3x, Looping section forever
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Pressable onPress={handlePress}>
          <RepeatIcon style={styles.repeatButton} />
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
