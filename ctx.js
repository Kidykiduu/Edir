import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading session from storage
    async function loadSession() {
      try {
        const token = await getStorageItem("auth_token");
        if (token) {
          // Simulate decoding token to get role
          // In a real app, verify token with your backend
          setSession({ token, role: token === "admin_token" ? "admin" : "user" });
        }
      } catch (e) {
        console.error("Error loading session:", e);
      }
      setIsLoading(false);
    }
    loadSession();
  }, []);

  async function setStorageItem(key, value) {
    if (Platform.OS === "web") {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } else {
      if (value === null) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    }
  }

  async function getStorageItem(key) {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  }

  const signIn = async (role) => {
    const token = role === "admin" ? "admin_token" : "user_token";
    await setStorageItem("auth_token", token);
    setSession({ token, role });
  };

  const signOut = async () => {
    await setStorageItem("auth_token", null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  return context;
}