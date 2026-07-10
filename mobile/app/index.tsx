import React from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CoachAvatar } from "@/components/ui/CoachAvatar";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Divider } from "@/components/ui/Divider";
import { useI18n } from "@/lib/i18n";
import { useSession, setCurrentClient } from "@/lib/session";
import { CHALLENGE_DAYS, ChallengeType } from "@/lib/types";

const CHALLENGES: ChallengeType[] = ["day11", "month1", "month3"];

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const session = useSession();
  const hasActiveClient = !!session.clientId;

  function handlePrimary() {
    if (hasActiveClient) {
      router.replace("/(app)/today");
    } else {
      router.push("/onboarding");
    }
  }

  function handleDemo() {
    setCurrentClient("seed-demo");
    router.replace("/(app)/today");
  }

  return (
    <SafeAreaView className="flex-1 bg-paper dark:bg-paper-dark" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-16 pt-2">
          <View className="flex-row justify-end">
            <LanguageToggle />
          </View>

          <View className="mt-8 items-center">
            <CoachAvatar size="xl" />
            <AppText variant="label" className="mt-6 text-brand-600 dark:text-brand-300">
              {t.welcome.eyebrow}
            </AppText>
            <AppText variant="display" className="mt-3 text-center">
              {t.welcome.title}
            </AppText>
            <AppText variant="body" className="mt-4 text-center text-ink-secondary">
              {t.welcome.subtitle}
            </AppText>
          </View>

          <View className="mt-8 gap-3">
            <Button label={hasActiveClient ? t.welcome.ctaContinue : t.welcome.ctaPrimary} onPress={handlePrimary} />
            <Button label={t.welcome.ctaDemo} variant="secondary" onPress={handleDemo} />
          </View>

          <View className="mt-14">
            <AppText variant="label" className="text-ink-muted">
              {t.welcome.featuresTitle}
            </AppText>
            <View className="mt-4 gap-5">
              {t.welcome.features.map((f, i) => (
                <View key={i}>
                  <View className="flex-row items-start gap-3">
                    <AppText variant="title">{f.icon}</AppText>
                    <View className="flex-1">
                      <AppText variant="bodyMedium">{f.title}</AppText>
                      <AppText variant="caption" className="mt-0.5 text-ink-secondary">
                        {f.desc}
                      </AppText>
                    </View>
                  </View>
                  {i < t.welcome.features.length - 1 && <Divider className="mt-5" />}
                </View>
              ))}
            </View>
          </View>

          <View className="mt-14">
            <AppText variant="label" className="text-ink-muted">
              {t.welcome.programsTitle}
            </AppText>
            <View className="mt-4 gap-3">
              {CHALLENGES.map((c) => (
                <View key={c} className="rounded-2xl border border-hairline p-5 dark:border-hairline-dark">
                  <View className="flex-row items-center justify-between">
                    <AppText variant="bodyMedium">{t.challenge[c]}</AppText>
                    <AppText variant="caption" className="text-gold-700 dark:text-gold-300">
                      {t.common.day(CHALLENGE_DAYS[c])}
                    </AppText>
                  </View>
                  <AppText variant="caption" className="mt-1.5 text-ink-secondary">
                    {t.challengeHint[c]}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-14 rounded-3xl bg-brand-600 px-7 py-9">
            <AppText variant="title" className="text-paper">
              {t.welcome.quote}
            </AppText>
            <AppText variant="body" className="mt-3 text-brand-100">
              {t.welcome.quoteBody}
            </AppText>
          </View>

          <AppText variant="caption" className="mt-10 text-center text-ink-muted">
            {t.welcome.footer}
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
