import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { addClient } from "@/lib/store";
import { setCurrentClient } from "@/lib/session";
import { newId } from "@/lib/id";
import { todayISO } from "@/lib/date";
import { CHALLENGE_DAYS, ChallengeType, Client, Goal } from "@/lib/types";

const GOAL_OPTIONS: { value: Goal; icon: string }[] = [
  { value: "loss", icon: "🥗" },
  { value: "gain", icon: "💪" },
  { value: "maintain", icon: "🌟" },
];

const CHALLENGE_OPTIONS: ChallengeType[] = ["day11", "month1", "month3"];

const GOAL_AVATAR: Record<Goal, { emoji: string; color: string }> = {
  loss: { emoji: "🥗", color: "#1F5738" },
  gain: { emoji: "💪", color: "#8C6428" },
  maintain: { emoji: "🌟", color: "#4A3AA7" },
};

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mt-7">
      <AppText variant="label" className="mb-2.5 text-ink-muted">
        {label}
      </AppText>
      {children}
    </View>
  );
}

function FieldInput(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      placeholderTextColor="#9B978A"
      className="border-b border-hairline pb-2.5 text-[16px] text-ink dark:border-hairline-dark dark:text-ink-inverted"
      {...props}
    />
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useI18n();

  const [name, setName] = useState("");
  const [goal, setGoal] = useState<Goal>("loss");
  const [weight, setWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [magicNumber, setMagicNumber] = useState("");
  const [waterGoalMl, setWaterGoalMl] = useState("2000");
  const [sleepGoalHours, setSleepGoalHours] = useState("7.5");
  const [challengeType, setChallengeType] = useState<ChallengeType>("day11");
  const [error, setError] = useState("");

  const suggestedMagicNumber = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;
    const maintenance = Math.round(w * 30);
    if (goal === "loss") return maintenance - 500;
    if (goal === "gain") return maintenance + 400;
    return maintenance;
  }, [weight, goal]);

  function handleSubmit() {
    const magic = parseFloat(magicNumber);
    if (!name.trim()) {
      setError(t.onboarding.errorName);
      return;
    }
    if (!magic || magic <= 0) {
      setError(t.onboarding.errorMagicNumber);
      return;
    }
    const avatar = GOAL_AVATAR[goal];
    const client: Client = {
      id: newId("client"),
      name: name.trim(),
      avatarEmoji: avatar.emoji,
      avatarColor: avatar.color,
      goal,
      startWeightKg: weight ? parseFloat(weight) : undefined,
      targetWeightKg: targetWeight ? parseFloat(targetWeight) : undefined,
      magicNumber: magic,
      waterGoalMl: Number(waterGoalMl) || 2000,
      sleepGoalHours: Number(sleepGoalHours) || 7.5,
      challengeType,
      challengeStartDate: todayISO(),
      joinedAt: new Date().toISOString(),
    };
    addClient(client);
    setCurrentClient(client.id);
    router.replace("/(app)/today");
  }

  return (
    <SafeAreaView className="flex-1 bg-paper dark:bg-paper-dark" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="px-6 pb-16 pt-4">
          <AppText variant="headline">{t.onboarding.title}</AppText>
          <AppText variant="body" className="mt-2 text-ink-secondary">
            {t.onboarding.subtitle}
          </AppText>

          <FormField label={t.onboarding.nameLabel}>
            <FieldInput
              value={name}
              onChangeText={setName}
              placeholder={t.onboarding.namePlaceholder}
              autoCapitalize="words"
            />
          </FormField>

          <FormField label={t.onboarding.goalLabel}>
            <View className="flex-row gap-2.5">
              {GOAL_OPTIONS.map((g) => {
                const active = goal === g.value;
                return (
                  <Pressable
                    key={g.value}
                    onPress={() => setGoal(g.value)}
                    className={`flex-1 items-center rounded-2xl border p-4 ${
                      active ? "border-brand-500 bg-brand-50" : "border-hairline dark:border-hairline-dark"
                    }`}
                  >
                    <AppText variant="title">{g.icon}</AppText>
                    <AppText variant="caption" className="mt-1.5 text-center text-ink-secondary">
                      {t.goal[g.value]}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </FormField>

          <View className="mt-7 flex-row gap-4">
            <View className="flex-1">
              <AppText variant="label" className="mb-2.5 text-ink-muted">
                {t.onboarding.weightLabel}
              </AppText>
              <FieldInput
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder={t.common.optional}
              />
            </View>
            <View className="flex-1">
              <AppText variant="label" className="mb-2.5 text-ink-muted">
                {t.onboarding.targetWeightLabel}
              </AppText>
              <FieldInput
                value={targetWeight}
                onChangeText={setTargetWeight}
                keyboardType="decimal-pad"
                placeholder={t.common.optional}
              />
            </View>
          </View>

          <FormField label={t.onboarding.magicNumberLabel}>
            <FieldInput
              value={magicNumber}
              onChangeText={setMagicNumber}
              keyboardType="number-pad"
              placeholder={t.onboarding.magicNumberPlaceholder}
            />
            {suggestedMagicNumber ? (
              <Pressable onPress={() => setMagicNumber(String(suggestedMagicNumber))}>
                <AppText variant="caption" className="mt-2.5 text-brand-600 dark:text-brand-300">
                  {t.onboarding.magicNumberSuggestion(suggestedMagicNumber)}
                </AppText>
              </Pressable>
            ) : (
              <AppText variant="caption" className="mt-2.5 text-ink-muted">
                {t.onboarding.magicNumberHelper}
              </AppText>
            )}
          </FormField>

          <View className="mt-7 flex-row gap-4">
            <View className="flex-1">
              <AppText variant="label" className="mb-2.5 text-ink-muted">
                {t.onboarding.waterGoalLabel}
              </AppText>
              <FieldInput value={waterGoalMl} onChangeText={setWaterGoalMl} keyboardType="number-pad" />
            </View>
            <View className="flex-1">
              <AppText variant="label" className="mb-2.5 text-ink-muted">
                {t.onboarding.sleepGoalLabel}
              </AppText>
              <FieldInput value={sleepGoalHours} onChangeText={setSleepGoalHours} keyboardType="decimal-pad" />
            </View>
          </View>

          <FormField label={t.onboarding.challengeLabel}>
            <View className="gap-2.5">
              {CHALLENGE_OPTIONS.map((c) => {
                const active = challengeType === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setChallengeType(c)}
                    className={`flex-row items-center justify-between rounded-2xl border p-4 ${
                      active ? "border-brand-500 bg-brand-50" : "border-hairline dark:border-hairline-dark"
                    }`}
                  >
                    <AppText variant="bodyMedium">{t.challenge[c]}</AppText>
                    <AppText variant="caption" className="text-gold-700">
                      {t.common.day(CHALLENGE_DAYS[c])}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </FormField>

          {error ? (
            <AppText variant="caption" className="mt-6 text-status-critical">
              {error}
            </AppText>
          ) : null}

          <Button label={t.onboarding.submit} onPress={handleSubmit} className="mt-9" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
