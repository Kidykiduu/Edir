import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useUserContext } from "../../../src/contexts/UserContext";
import { apiCall } from "../../../src/utils/api";

const ResourceManagement = () => {
  const { t } = useTranslation();
  const { user } = useUserContext();
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.edirId) {
      const fetchResources = async () => {
        try {
          const response = await apiCall(`/edir/${user.edirId}/resources`, { method: "GET" });
          if (response.ok) {
            const data = await response.json();
            setResources(data);
          } else {
            setError(t("fetchResourcesFailed"));
          }
        } catch (err) {
          setError(t("networkError"));
        }
      };
      fetchResources();
    }
  }, [user, t]);

  const approveResource = async (resourceId) => {
    try {
      const response = await apiCall(`/resources/${resourceId}/approve`, { method: "POST" });
      if (response.ok) {
        setResources(
          resources.map((resource) =>
            resource.id === resourceId ? { ...resource, status: "approved" } : resource
          )
        );
      } else {
        setError(t("approveResourceFailed"));
      }
    } catch (err) {
      setError(t("networkError"));
    }
  };

  const rejectResource = async (resourceId) => {
    try {
      const response = await apiCall(`/resources/${resourceId}/reject`, { method: "POST" });
      if (response.ok) {
        setResources(
          resources.map((resource) =>
            resource.id === resourceId ? { ...resource, status: "rejected" } : resource
          )
        );
      } else {
        setError(t("rejectResourceFailed"));
      }
    } catch (err) {
      setError(t("networkError"));
    }
  };

  const renderResource = ({ item }) => (
    <View style={styles.resourceItem}>
      <Text style={styles.resourceName}>{item.name}</Text>
      <Text style={styles.resourceDetails}>{t("quantity")}: {item.quantity}</Text>
      <Text style={styles.resourceDetails}>{t("status")}: {item.status}</Text>
      {item.status === "pending" && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.approveButton} onPress={() => approveResource(item.id)}>
            <Text style={styles.buttonText}>{t("approve")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton} onPress={() => rejectResource(item.id)}>
            <Text style={styles.buttonText}>{t("reject")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("manageResources")}</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={resources}
        renderItem={renderResource}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>{t("noResources")}</Text>}
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
  resourceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d0dbe7",
  },
  resourceName: {
    color: "#0e141b",
    fontSize: 16,
    fontWeight: "500",
  },
  resourceDetails: {
    color: "#4e7397",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  approveButton: {
    backgroundColor: "#22c55e",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    padding: 8,
  },
  buttonText: {
    color: "white",
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

export default ResourceManagement;