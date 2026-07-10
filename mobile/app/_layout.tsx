import "../global.css";
import React, { useCallback, useEffect, useState } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import {
  useFonts,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from "@expo-google-fonts/fraunces";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { I18nProvider } from "@/lib/i18n";
import { hydrateStore } from "@/lib/store";
import { hydrateSession } from "@/lib/session";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    Promise.all([hydrateStore(), hydrateSession()]).then(() => setDataReady(true));
  }, []);

  const ready = fontsLoaded && dataReady;

  const onLayoutReady = useCallback(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  useEffect(onLayoutReady, [onLayoutReady]);

  if (!ready) return <View className="flex-1 bg-paper" />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#F7F5EF" } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(app)" />
          </Stack>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
