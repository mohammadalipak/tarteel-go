import { ImageBackground, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AudioPlayer from "@/components/AudioPlayer";
import Header from "@/components/Header";
import Mushaf from "@/components/Mushaf";
import RepetitionSettings from "@/components/RepetitionSettings";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { useAppStore } from "@/store/useAppStore";

export default function Index() {
  const insets = useSafeAreaInsets();
  const { showRepetitionSettings } = useAppStore();

  return (
    <AudioPlayerProvider>
      <ImageBackground
        source={require("@/assets/images/green-bg.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Header style={[styles.header, { marginTop: insets.top }]}></Header>
          {showRepetitionSettings ? (
            <RepetitionSettings style={styles.content}></RepetitionSettings>
          ) : (
            <Mushaf style={styles.content}></Mushaf>
          )}
          <AudioPlayer
            style={[styles.footer, { paddingBottom: insets.bottom }]}
          ></AudioPlayer>
        </View>
      </ImageBackground>
    </AudioPlayerProvider>
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
    marginVertical: 20,
  },
  footer: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
});
