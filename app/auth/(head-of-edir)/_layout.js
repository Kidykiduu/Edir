import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function HeadOfEdirLayout() {
  const { t } = useTranslation();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="dashboard" options={{ title: t("dashboard") }} />
      <Tabs.Screen name="groups" options={{ title: t("groups") }} />
      <Tabs.Screen name="events" options={{ title: t("events") }} />
      <Tabs.Screen name="reports" options={{ title: t("reports") }} />
      <Tabs.Screen name="notifications" options={{ title: t("notifications") }} />
      <Tabs.Screen name="resources" options={{ title: t("resources") }} />
      <Tabs.Screen name="users" options={{ title: t("users") }} />
    </Tabs>
  );
}