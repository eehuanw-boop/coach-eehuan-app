import React from "react";
import { ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/components/ui/AppText";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { PhotoTile, MealPhotoGrid } from "@/components/ui/PhotoTile";
import { WaterTracker } from "@/components/WaterTracker";
import { SleepTracker } from "@/components/SleepTracker";
import { ChallengeProgressBar } from "@/components/ChallengeProgressBar";
import { FeedbackThread } from "@/components/FeedbackThread";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { useAppData, getClient, getLog, getLogsForClient, getFeedbackForClient, upsertLog } from "@/lib/store";
import { newId } from "@/lib/id";
import { todayISO } from "@/lib/date";
import { challengeProgress, currentStreak } from "@/lib/stats";
import { DailyLog, SleepQuality } from "@/lib/types";

export default function TodayScreen() {
  const { t } = useI18n();
  const session = useSession();
  const data = useAppData();
  const today = todayISO();

  const client = session.clientId ? getClient(data, session.clientId) : undefined;
  if (!client) return null;

  const log = getLog(data, client.id, today);
  const logs = getLogsForClient(data, client.id);
  const feedback = getFeedbackForClient(data, client.id);
  const progress = challengeProgress(client);
  const streak = currentStreak(logs);
  const calories = log?.calories ?? 0;
  const caloriePercent = Math.min(100, Math.round((calories / client.magicNumber) * 100));

  function patchToday(patch: Partial<DailyLog>) {
    const existing: DailyLog =
      log ?? { id: newId("log"), clientId: client!.id, date: today, mealPhotos: [], waterMl: 0, updatedAt: "" };
    upsertLog({ ...existing, ...patch, updatedAt: new Date().toISOString() });
  }

  return (
    <SafeAreaView className="flex-1 bg-paper dark:bg-paper-dark" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-16 pt-4">
          <AppText variant="headline">{t.today.greeting(client.name)}</AppText>
          <AppText variant="body" className="mt-1 text-ink-secondary">
            {t.today.subtitle}
          </AppText>

          <View className="mt-8">
            <ChallengeProgressBar challengeType={client.challengeType} progress={progress} streak={streak} />
          </View>

          <View className="mt-10 flex-row items-center gap-5">
            <ProgressRing percent={caloriePercent} color="#B8873B" size={100} strokeWidth={9}>
              <AppText variant="title">{calories || "–"}</AppText>
              <AppText variant="caption" className="text-ink-muted">
                /{client.magicNumber}
              </AppText>
            </ProgressRing>
            <View className="flex-1">
              <AppText variant="bodyMedium">🎯 {t.today.magicNumberTitle}</AppText>
              <AppText variant="caption" className="mt-1 text-ink-secondary">
                {t.today.magicNumberSubtitle(client.magicNumber)}
              </AppText>
              <TextInput
                value={log?.calories != null ? String(log.calories) : ""}
                onChangeText={(v) => patchToday({ calories: v ? Number(v) : undefined })}
                keyboardType="number-pad"
                placeholder={t.today.magicNumberPlaceholder}
                placeholderTextColor="#9B978A"
                className="mt-3 border-b border-hairline pb-2 text-[15px] text-ink dark:border-hairline-dark dark:text-ink-inverted"
              />
            </View>
          </View>

          <View className="mt-12">
            <AppText variant="label" className="mb-4 text-ink-muted">
              {t.today.photosTitle}
            </AppText>
            <View className="flex-row gap-3">
              <PhotoTile label={t.today.shake} value={log?.shakePhoto} onChange={(uri) => patchToday({ shakePhoto: uri })} />
              <PhotoTile
                label={t.today.supplements}
                value={log?.supplementPhoto}
                onChange={(uri) => patchToday({ supplementPhoto: uri })}
              />
            </View>
            <View className="mt-3">
              <AppText variant="caption" className="mb-2 text-ink-secondary">
                {t.today.meals}
              </AppText>
              <MealPhotoGrid
                photos={log?.mealPhotos ?? []}
                onAdd={(uri) => patchToday({ mealPhotos: [...(log?.mealPhotos ?? []), uri] })}
                onRemove={(idx) => patchToday({ mealPhotos: (log?.mealPhotos ?? []).filter((_, i) => i !== idx) })}
              />
            </View>
          </View>

          <View className="mt-12">
            <WaterTracker
              waterMl={log?.waterMl ?? 0}
              goalMl={client.waterGoalMl}
              onChange={(ml) => patchToday({ waterMl: ml })}
            />
          </View>

          <View className="mt-10">
            <SleepTracker
              hours={log?.sleepHours}
              quality={log?.sleepQuality}
              goalHours={client.sleepGoalHours}
              onHoursChange={(h) => patchToday({ sleepHours: h })}
              onQualityChange={(q: SleepQuality) => patchToday({ sleepQuality: q })}
            />
          </View>

          <View className="mt-12">
            <AppText variant="label" className="mb-4 text-ink-muted">
              {t.today.feedbackTitle}
            </AppText>
            <FeedbackThread items={feedback.slice(0, 5)} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
