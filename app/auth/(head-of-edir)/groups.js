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

const GroupManagement = () => {
  const { t } = useTranslation();
  const { user } = useUserContext();
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.edirId) {
      const fetchGroups = async () => {
        try {
          const response = await apiCall(`/edir/${user.edirId}/groups`, { method: "GET" });
          if (response.ok) {
            const data = await response.json();
            setGroups(data);
          } else {
            setError(t("fetchGroupsFailed"));
          }
        } catch (err) {
          setError(t("networkError"));
        }
      };
      fetchGroups();
    }
  }, [user, t]);

  const createGroup = async () => {
    if (!newGroupName.trim()) {
      setError(t("groupNameRequired"));
      return;
    }
    try {
      const response = await apiCall(`/edir/${user.edirId}/groups`, {
        method: "POST",
        body: JSON.stringify({ name: newGroupName }),
      });
      if (response.ok) {
        const data = await response.json();
        setGroups([...groups, data]);
        setNewGroupName("");
        setError("");
      } else {
        setError(t("createGroupFailed"));
      }
    } catch (err) {
      setError(t("networkError"));
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const response = await apiCall(`/groups/${groupId}`, { method: "DELETE" });
      if (response.ok) {
        setGroups(groups.filter((group) => group.id !== groupId));
      } else {
        setError(t("deleteGroupFailed"));
      }
    } catch (err) {
      setError(t("networkError"));
    }
  };

  const renderGroup = ({ item }) => (
    <View style={styles.groupItem}>
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupDetails}>{t("members")}: {item.members || 0}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteGroup(item.id)}>
        <Text style={styles.deleteButtonText}>{t("delete")}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("manageGroups")}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={newGroupName}
          onChangeText={setNewGroupName}
          placeholder={t("enterGroupName")}
          placeholderTextColor="#4e7397"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.createButton} onPress={createGroup}>
          <Text style={styles.createButtonText}>{t("createGroup")}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>{t("noGroups")}</Text>}
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
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 4,
  },
  createButton: {
    backgroundColor: "#1976D2",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  groupItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d0dbe7",
  },
  groupName: {
    color: "#0e141b",
    fontSize: 16,
    fontWeight: "500",
  },
  groupDetails: {
    color: "#4e7397",
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    padding: 8,
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

export default GroupManagement;