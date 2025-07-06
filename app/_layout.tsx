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
    Lalezar: require("../assets/fonts/Lalezar-Regular.ttf"),
    Makkah: require("../assets/fonts/Makkah-Bold.ttf"),
    May: require("../assets/fonts/May-Bold.ttf"),
    QuranKareem: require("../assets/fonts/Al-QuranAlKareem-Bold.ttf"),
    UthmanicHafs: require("@/assets/fonts/UthmanicHafs1Ver18.ttf"),
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
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
