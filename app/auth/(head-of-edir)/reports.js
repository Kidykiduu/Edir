import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useUserContext } from "../../../src/contexts/UserContext";
import { apiCall } from "../../../src/utils/api";

const ReportGeneration = () => {
  const { t } = useTranslation();
  const { user } = useUserContext();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.edirId) {
      const fetchReports = async () => {
        try {
          const response = await apiCall(`/edir/${user.edirId}/reports`, { method: "GET" });
          if (response.ok) {
            const data = await response.json();
            setReports(data);
          } else {
            setError(t("fetchReportsFailed"));
          }
        } catch (err) {
          setError(t("networkError"));
        }
      };
      fetchReports();
    }
  }, [user, t]);

  const renderReport = ({ item }) => (
    <View style={styles.reportItem}>
      <Text style={styles.reportType}>{item.type}</Text>
      <Text style={styles.reportDetails}>{t("date")}: {item.date}</Text>
      <Text style={styles.reportDetails}>{t("summary")}: {item.summary}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("reports")}</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>{t("noReports")}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: Platform.OS === "web" ? "10%" : 16,
  },
  title: {
    color: "#0e141b",
    fontSize: Platform.OS === "web" ? 28 : 22,
    fontWeight: "bold",
    marginVertical: 20,
  },
  reportItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d0dbe7",
  },
  reportType: {
    color: "#0e141b",
    fontSize: 16,
    fontWeight: "500",
  },
  reportDetails: {
    color: "#4e7397",
    fontSize: 14,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 12,
  },
  emptyText: {
    color: "#4e7397",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default ReportGeneration;