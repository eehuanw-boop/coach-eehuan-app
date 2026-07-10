import React from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/components/ui/AppText";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Divider } from "@/components/ui/Divider";
import { useI18n } from "@/lib/i18n";
import { useSession, clearSession } from "@/lib/session";
import { useAppData, getClient } from "@/lib/store";

export default function ProfileScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const session = useSession();
  const data = useAppData();
  const client = session.clientId ? getClient(data, session.clientId) : undefined;
  if (!client) return null;

  const rows: { label: string; value: string }[] = [
    { label: t.profile.goalRow, value: t.goal[client.goal] },
    { label: t.profile.magicNumberRow, value: `${client.magicNumber} ${t.common.kcal}` },
    { label: t.profile.waterRow, value: `${(client.waterGoalMl / 1000).toFixed(1)} L` },
    { label: t.profile.sleepRow, value: `${client.sleepGoalHours} ${t.common.hours}` },
    { label: t.profile.programRow, value: t.challenge[client.challengeType] },
  ];

  function handleStartOver() {
    Alert.alert(t.profile.startOver, t.profile.startOverConfirm, [
      { text: t.common.cancel, style: "cancel" },
      {
        text: t.profile.startOver,
        style: "destructive",
        onPress: () => {
          clearSession();
          router.replace("/");
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-paper dark:bg-paper-dark" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-16 pt-4">
          <View className="flex-row items-center justify-between">
            <AppText variant="headline">{t.profile.title}</AppText>
            <LanguageToggle />
          </View>

          <View className="mt-8 flex-row items-center gap-3">
            <View
              className="h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: client.avatarColor }}
            >
              <AppText variant="title" className="text-paper">
                {client.avatarEmoji}
              </AppText>
            </View>
            <AppText variant="title">{client.name}</AppText>
          </View>

          <View className="mt-10">
            <AppText variant="label" className="mb-4 text-ink-muted">
              {t.profile.yourPlan}
            </AppText>
            {rows.map((row, i) => (
              <View key={row.label}>
                <View className="flex-row items-center justify-between py-3.5">
                  <AppText variant="body" className="text-ink-secondary">
                    {row.label}
                  </AppText>
                  <AppText variant="bodyMedium">{row.value}</AppText>
                </View>
                {i < rows.length - 1 && <Divider />}
              </View>
            ))}
          </View>

          <Pressable onPress={handleStartOver} className="mt-12">
            <AppText variant="bodyMedium" className="text-status-critical text-center">
              {t.profile.startOver}
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
