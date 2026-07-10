import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";

export default function AppTabsLayout() {
  const { t } = useI18n();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session.clientId) router.replace("/");
  }, [session.clientId, router]);

  if (!session.clientId) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1F5738",
        tabBarInactiveTintColor: "#9B978A",
        tabBarStyle: {
          backgroundColor: "#FBFAF6",
          borderTopColor: "#E4E1D6",
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: t.tabs.today,
          tabBarIcon: ({ color, size }) => <Feather name="sun" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t.tabs.history,
          tabBarIcon: ({ color, size }) => <Feather name="calendar" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.tabs.profile,
          tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
