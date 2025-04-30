import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useUserContext } from "../../../src/contexts/UserContext";
import { apiCall } from "../../../src/utils/api";

const NotificationSystem = () => {
  const { t } = useTranslation();
  const { user } = useUserContext();
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.edirId) {
      const fetchNotifications = async () => {
        try {
          const response = await apiCall(`/edir/${user.edirId}/notifications`, { method: "GET" });
          if (response.ok) {
            const data = await response.json();
            setNotifications(data);
          } else {
            setError(t("fetchNotificationsFailed"));
          }
        } catch (err) {
          setError(t("networkError"));
        }
      };
      fetchNotifications();
    }
  }, [user, t]);

  const sendNotification = async () => {
    if (!newNotification.trim()) {
      setError(t("notificationRequired"));
      return;
    }
    try {
      const response = await apiCall(`/edir/${user.edirId}/notifications`, {
        method: "POST",
        body: JSON.stringify({ message: newNotification }),
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications([...notifications, data]);
        setNewNotification("");
        setError("");
      } else {
        setError(t("sendNotificationFailed"));
      }
    } catch (err) {
      setError(t("networkError"));
    }
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationDate}>{t("date")}: {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("notifications")}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={newNotification}
          onChangeText={setNewNotification}
          placeholder={t("enterNotification")}
          placeholderTextColor="#4e7397"
          multiline
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.sendButton} onPress={sendNotification}>
          <Text style={styles.sendButtonText}>{t("sendNotification")}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>{t("noNotifications")}</Text>}
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
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#d0dbe7",
    borderRadius: 12,
    height: 100,
    padding: 16,
    fontSize: 16,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 12,
  },
  sendButton: {
    backgroundColor: "#1976D2",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d0dbe7",
  },
  notificationMessage: {
    color: "#0e141b",
    fontSize: 16,
    fontWeight: "500",
  },
  notificationDate: {
    color: "#4e7397",
    fontSize: 14,
  },
  emptyText: {
    color: "#4e7397",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default NotificationSystem;