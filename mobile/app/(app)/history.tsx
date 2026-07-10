import React, { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/components/ui/AppText";
import { StatusDot } from "@/components/ui/StatusDot";
import { StatusPill } from "@/components/ui/StatusPill";
import { FeedbackThread } from "@/components/FeedbackThread";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { useAppData, getClient, getLog, getFeedbackForClient } from "@/lib/store";
import { dateRange, todayISO } from "@/lib/date";
import { calorieStatus, dayStatus, sleepStatus, waterStatus } from "@/lib/stats";
import { parsePlaceholder } from "@/lib/photo";

function DayPhoto({ uri }: { uri: string }) {
  const placeholder = parsePlaceholder(uri);
  if (placeholder) {
    return (
      <View
        className="h-20 w-20 items-center justify-center rounded-xl"
        style={{ backgroundColor: placeholder.bg }}
      >
        <AppText variant="title">{placeholder.emoji}</AppText>
      </View>
    );
  }
  return <Image source={{ uri }} className="h-20 w-20 rounded-xl" resizeMode="cover" />;
}

export default function HistoryScreen() {
  const { t, formatShortDate, formatWeekday } = useI18n();
  const session = useSession();
  const data = useAppData();
  const today = todayISO();
  const [selectedDate, setSelectedDate] = useState(today);

  const client = session.clientId ? getClient(data, session.clientId) : undefined;
  if (!client) return null;

  const days = dateRange(client.challengeStartDate, today).reverse();
  const feedback = getFeedbackForClient(data, client.id);
  const selectedLog = getLog(data, client.id, selectedDate);
  const selectedFeedback = feedback.filter((f) => f.logDate === selectedDate);
  const photos = selectedLog
    ? [selectedLog.shakePhoto, selectedLog.supplementPhoto, ...selectedLog.mealPhotos].filter(Boolean) as string[]
    : [];

  return (
    <SafeAreaView className="flex-1 bg-paper dark:bg-paper-dark" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-16 pt-4">
          <AppText variant="headline">{t.history.title}</AppText>
          <AppText variant="body" className="mt-1 text-ink-secondary">
            {t.history.subtitle(formatShortDate(client.challengeStartDate))}
          </AppText>

          <View className="mt-6 flex-row flex-wrap gap-y-2">
            {days.map((d) => {
              const status = dayStatus(getLog(data, client.id, d), client);
              const selected = d === selectedDate;
              return (
                <Pressable
                  key={d}
                  onPress={() => setSelectedDate(d)}
                  style={{ width: "14.28%" }}
                  className="items-center gap-1.5 py-2"
                >
                  <AppText variant="caption" className="text-ink-muted">
                    {formatWeekday(d)}
                  </AppText>
                  <View
                    className={`h-9 w-9 items-center justify-center rounded-full ${
                      selected ? "bg-brand-600" : ""
                    }`}
                  >
                    <StatusDot status={status} />
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-6 rounded-2xl border border-hairline p-5 dark:border-hairline-dark">
            <View className="flex-row items-center justify-between">
              <AppText variant="bodyMedium">
                {formatShortDate(selectedDate)} · {formatWeekday(selectedDate)}
              </AppText>
              <StatusDot status={dayStatus(selectedLog, client)} />
            </View>

            {!selectedLog ? (
              <AppText variant="caption" className="mt-4 text-ink-muted">
                {t.history.emptyDay}
              </AppText>
            ) : (
              <>
                {photos.length > 0 && (
                  <View className="mt-4 flex-row flex-wrap gap-2">
                    {photos.map((p, i) => (
                      <DayPhoto key={i} uri={p} />
                    ))}
                  </View>
                )}
                <View className="mt-4 flex-row gap-2">
                  <View className="flex-1 items-center rounded-xl bg-surface p-3 dark:bg-surface-dark">
                    <AppText variant="caption" className="text-ink-muted">
                      {t.history.calories}
                    </AppText>
                    <AppText variant="bodyMedium" className="mt-1">
                      {selectedLog.calories ?? "–"}
                    </AppText>
                    <StatusPill status={calorieStatus(selectedLog, client)} className="mt-1.5" />
                  </View>
                  <View className="flex-1 items-center rounded-xl bg-surface p-3 dark:bg-surface-dark">
                    <AppText variant="caption" className="text-ink-muted">
                      {t.history.water}
                    </AppText>
                    <AppText variant="bodyMedium" className="mt-1">
                      {(selectedLog.waterMl / 1000).toFixed(1)}L
                    </AppText>
                    <StatusPill status={waterStatus(selectedLog, client)} className="mt-1.5" />
                  </View>
                  <View className="flex-1 items-center rounded-xl bg-surface p-3 dark:bg-surface-dark">
                    <AppText variant="caption" className="text-ink-muted">
                      {t.history.sleep}
                    </AppText>
                    <AppText variant="bodyMedium" className="mt-1">
                      {selectedLog.sleepHours ?? "–"}h
                    </AppText>
                    <StatusPill status={sleepStatus(selectedLog, client)} className="mt-1.5" />
                  </View>
                </View>
              </>
            )}

            {selectedFeedback.length > 0 && (
              <View className="mt-5">
                <AppText variant="label" className="mb-2 text-ink-muted">
                  {t.history.coachNotes}
                </AppText>
                <FeedbackThread items={selectedFeedback} />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
