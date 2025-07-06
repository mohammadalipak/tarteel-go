import { ImageBackground, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AudioPlayer from "@/components/AudioPlayer";
import Header from "@/components/Header";
import Mushaf from "@/components/Mushaf";

export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require("@/assets/images/green-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Header style={[styles.header, { marginTop: insets.top }]}></Header>
        <Mushaf style={styles.content}></Mushaf>
        <AudioPlayer
          style={[styles.footer, { paddingBottom: insets.bottom }]}
        ></AudioPlayer>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 30,
  },
  header: {
    paddingHorizontal: 30,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
});
