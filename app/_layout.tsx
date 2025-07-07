import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: require("../assets/fonts/InterVariable.ttf"),
    Lalezar: require("../assets/fonts/Lalezar-Regular.ttf"),
    Makkah: require("../assets/fonts/Makkah-Bold.ttf"),
    May: require("../assets/fonts/May-Bold.ttf"),
    QuranKareem: require("../assets/fonts/Al-QuranAlKareem-Bold.ttf"),
    SFProRoundedBold: require("../assets/fonts/SF-Pro-Rounded-Bold.otf"),
    UthmanicHafs: require("../assets/fonts/UthmanicHafs1Ver18.ttf"),
    Zar: require("../assets/fonts/Zar-Bold.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
