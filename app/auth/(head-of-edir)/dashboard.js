import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { useUserContext } from "../../../src/contexts/UserContext";

const HeadOfEdirDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useUserContext();
  const router = useRouter();

  // Redirect if not HeadOfEdir
  if (!user?.isEdirHead) {
    router.replace("/sign-in");
    return null;
  }

  const sections = [
    { id: "groups", label: t("groups"), route: "/(auth)/(head-of-edir)/groups" },
    { id: "events", label: t("events"), route: "/(auth)/(head-of-edir)/events" },
    { id: "reports", label: t("reports"), route: "/(auth)/(head-of-edir)/reports" },
    { id: "notifications", label: t("notifications"), route: "/(auth)/(head-of-edir)/notifications" },
    { id: "resources", label: t("resources"), route: "/(auth)/(head-of-edir)/resources" },
    { id: "users", label: t("users"), route: "/(auth)/(head-of-edir)/users" },
  ];

  const navigateTo = (route) => {
    router.push(route);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("headOfEdirDashboard")}</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await logout();
            router.replace("/sign-in");
          }}
        >
          <Text style={styles.logoutText}>{t("logout")}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.welcomeText}>
        {t("welcomeMessage", { name: user?.name || "Head of Edir" })}
      </Text>
      <Text style={styles.description}>
        {t("dashboardDescription")}
      </Text>

      <View style={styles.sectionsContainer}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={styles.sectionButton}
            onPress={() => navigateTo(section.route)}
          >
            <Text style={styles.sectionText}>{section.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: Platform.OS === "web" ? "10%" : 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    color: "#0e141b",
    fontSize: Platform.OS === "web" ? 28 : 22,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    padding: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  welcomeText: {
    color: "#0e141b",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  description: {
    color: "#4e7397",
    fontSize: 16,
    marginBottom: 20,
  },
  sectionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sectionButton: {
    backgroundColor: "#1976D2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: Platform.OS === "web" ? "48%" : "100%",
    alignItems: "center",
  },
  sectionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HeadOfEdirDashboard;