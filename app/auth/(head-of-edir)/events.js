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

const EventManagement = () => {
  const { t } = useTranslation();
  const { user } = useUserContext();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", assigned: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.edirId) {
      const fetchEvents = async () => {
        try {
          const response = await apiCall(`/edir/${user.edirId}/events`, { method: "GET" });
          if (response.ok) {
            const data = await response.json();
            setEvents(data);
          } else {
            setError(t("fetchEventsFailed"));
          }
        } catch (err) {
          setError(t("networkError"));
        }
      };
      fetchEvents();
    }
  }, [user, t]);

  const createEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.date.trim()) {
      setError(t("eventDetailsRequired"));
      return;
    }
    try {
      const response = await apiCall(`/edir/${user.edirId}/events`, {
        method: "POST",
        body: JSON.stringify(newEvent),
      });
      if (response.ok) {
        const data = await response.json();
        setEvents([...events, data]);
        setNewEvent({ title: "", date: "", assigned: "" });
        setError("");
      } else {
        setError(t("createEventFailed"));
      }
    } catch (err) {
      setError(t("networkError"));
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await apiCall(`/events/${eventId}`, { method: "DELETE" });
      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId));
      } else {
        setError(t("deleteEventFailed"));
      }
    } catch (err) {
      setError(t("networkError"));
    }
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDetails}>{t("date")}: {item.date}</Text>
      <Text style={styles.eventDetails}>{t("assigned")}: {item.assigned}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteEvent(item.id)}>
        <Text style={styles.deleteButtonText}>{t("delete")}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("manageEvents")}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={newEvent.title}
          onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
          placeholder={t("eventTitle")}
          placeholderTextColor="#4e7397"
        />
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={newEvent.date}
          onChangeText={(text) => setNewEvent({ ...newEvent, date: text })}
          placeholder={t("eventDate")}
          placeholderTextColor="#4e7397"
        />
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={newEvent.assigned}
          onChangeText={(text) => setNewEvent({ ...newEvent, assigned: text })}
          placeholder={t("assignedGroup")}
          placeholderTextColor="#4e7397"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.createButton} onPress={createEvent}>
          <Text style={styles.createButtonText}>{t("createEvent")}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>{t("noEvents")}</Text>}
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
    height: 56,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
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
  createButton: {
    backgroundColor: "#1976D2",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  eventItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d0dbe7",
  },
  eventTitle: {
    color: "#0e141b",
    fontSize: 16,
    fontWeight: "500",
  },
  eventDetails: {
    color: "#4e7397",
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
  },
  emptyText: {
    color: "#4e7397",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default EventManagement;