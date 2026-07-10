import React, { useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useI18n } from "@/lib/i18n";
import { parsePlaceholder } from "@/lib/photo";
import { AppText } from "./AppText";

async function captureOrPickPhoto(): Promise<string | null> {
  try {
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    const result = cameraPerm.status === "granted"
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.5, base64: true })
      : await (async () => {
          const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (libPerm.status !== "granted") return null;
          return ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.5, base64: true });
        })();
    if (!result || result.canceled || !result.assets?.[0]?.base64) return null;
    return `data:image/jpeg;base64,${result.assets[0].base64}`;
  } catch {
    return null;
  }
}

function PhotoContent({ value }: { value?: string }) {
  if (!value) return null;
  const placeholder = parsePlaceholder(value);
  if (placeholder) {
    return (
      <View className="h-full w-full items-center justify-center" style={{ backgroundColor: placeholder.bg }}>
        <Text style={{ fontSize: 36 }}>{placeholder.emoji}</Text>
      </View>
    );
  }
  return <Image source={{ uri: value }} className="h-full w-full" resizeMode="cover" />;
}

export function PhotoTile({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (uri: string) => void;
}) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);

  async function handlePress() {
    setBusy(true);
    const uri = await captureOrPickPhoto();
    setBusy(false);
    if (uri) onChange(uri);
  }

  return (
    <Pressable
      onPress={handlePress}
      className="aspect-square flex-1 items-center justify-center overflow-hidden rounded-2xl border border-hairline bg-surface dark:border-hairline-dark dark:bg-surface-dark"
    >
      <PhotoContent value={value} />
      {!value && (
        <View className="items-center gap-1 px-2">
          <AppText variant="bodyMedium" className="text-ink-secondary text-center">
            {label}
          </AppText>
          <AppText variant="caption" className="text-ink-muted text-center">
            {t.today.tapToCapture}
          </AppText>
        </View>
      )}
      {value && (
        <View className="absolute inset-x-0 bottom-0 bg-black/45 py-1.5">
          <AppText variant="caption" className="text-center text-paper">
            {t.today.retake}
          </AppText>
        </View>
      )}
      {busy && (
        <View className="absolute inset-0 items-center justify-center bg-black/25">
          <ActivityIndicator color="#F7F5EF" />
        </View>
      )}
    </Pressable>
  );
}

export function MealPhotoGrid({
  photos,
  onAdd,
  onRemove,
}: {
  photos: string[];
  onAdd: (uri: string) => void;
  onRemove: (index: number) => void;
}) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);

  async function handleAdd() {
    setBusy(true);
    const uri = await captureOrPickPhoto();
    setBusy(false);
    if (uri) onAdd(uri);
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      {photos.map((p, i) => (
        <View key={i} className="h-20 w-20 overflow-hidden rounded-xl border border-hairline dark:border-hairline-dark">
          <PhotoContent value={p} />
          <Pressable
            onPress={() => onRemove(i)}
            accessibilityLabel="Remove photo"
            className="absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-full bg-black/55"
          >
            <Text className="text-xs text-paper">×</Text>
          </Pressable>
        </View>
      ))}
      <Pressable
        onPress={handleAdd}
        className="h-20 w-20 items-center justify-center rounded-xl border border-dashed border-hairline dark:border-hairline-dark"
      >
        {busy ? (
          <ActivityIndicator color="#1F5738" />
        ) : (
          <>
            <Text className="text-lg text-ink-muted">+</Text>
            <AppText variant="caption" className="text-ink-muted">
              {t.today.addMeal}
            </AppText>
          </>
        )}
      </Pressable>
    </View>
  );
}
