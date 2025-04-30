import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { useUserContext } from "../../src/contexts/UserContext";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiCall } from "../../src/utils/api";

const arrowLeftIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0e141b" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>`;

const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4e7397" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/></svg>`;

const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4e7397" viewBox="0 0 256 256"><path d="M53.92,34.62a8,8,0,1,0-11.84,10.76l19.24,21.17C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76ZM128,192c-23.31,0-44.56-6.19-62.25-16.3a134.18,134.18,0,0,0,24.17-18.72l18.74,20.61a40,40,0,1,0,35.2-35.2l16.07,17.67A80.17,80.17,0,0,1,128,192ZM74.08,93.22,99.15,118.3a40,40,0,0,0,42.55,42.55l17.55,19.31A80.46,80.46,0,0,1,128,160a80.08,80.08,0,0,1-80-80A79.34,79.34,0,0,1,74.08,93.22ZM245.2,124.76c-.35-.79-8.82-19.57-27.65-38.4-23.35-23.35-50.77-35-81.74-35.85a8,8,0,0,0-8.81,8.8c.81,31,12.5,58.41,35.85,81.75,18.83,18.83,37.61,27.3,38.4,27.65a8,8,0,0,0,6.5,0C247.26,147.47,247.26,129.06,245.2,124.76ZM165.1,152.47a8,8,0,0,1-2.32,5.53L150.47,165.1a8,8,0,0,1-11.31-11.31l12.31-12.31a8,8,0,0,1,11.31,0A8,8,0,0,1,165.1,152.47Z"/></svg>`;

const LoginScreen = () => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const { user, setUser } = useUserContext();
  const router = useRouter();

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      if (user.hasCompletedRegistration) {
        let pathRole;
        if (user.isEdirHead) {
          pathRole = "head-of-edir";
        } else if (user.roles.includes("MONEY_COLLECTOR")) {
          pathRole = "money-collector";
        } else if (user.roles.includes("RESOURCE_HANDLER")) {
          pathRole = "resource-handler";
        } else if (user.roles.includes("MEMBER")) {
          pathRole = "regular-user";
        } else {
          pathRole = "regular-user";
        }
        router.replace(`/(auth)/(${pathRole})/dashboard`);
      } else {
        router.replace("/family-form");
      }
    }
  }, [user, router]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = t("usernameRequired");
      isValid = false;
    }

    if (!password) {
      newErrors.password = t("passwordRequired");
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = t("passwordLengthError");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await apiCall("url" ,{
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem("accessToken", data.access);
        await AsyncStorage.setItem("refreshToken", data.refresh);
        const userData = {
          username: data.username,
          email: data.email,
          roles: data.roles,
          isEdirHead: data.is_edir_head,
          verificationStatus: data.verification_status,
          edir: data.edir,
          hasCompletedRegistration: true,
        };
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        // Debugging logs (remove in production)
        AsyncStorage.getItem("accessToken").then(console.log);
        AsyncStorage.getItem("refreshToken").then(console.log);
        AsyncStorage.getItem("user").then((data) => console.log(JSON.parse(data)));
      } else {
        const errorData = await response.json();
        Alert.alert(t("error"), errorData.message || t("loginFailed"));
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(t("error"), t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => router.back()}>
        <SvgXml xml={arrowLeftIcon} width={24} height={24} />
      </TouchableOpacity>

      <Text style={styles.title}>{t("login")}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.username && styles.inputError]}
          placeholder={t("username")}
          placeholderTextColor="#4e7397"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
          }}
          autoCapitalize="none"
        />
        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.passwordInputWrapper}>
          <TextInput
            style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
            placeholder={t("password")}
            placeholderTextColor="#4e7397"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIconContainer}
            onPress={togglePasswordVisibility}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <SvgXml xml={showPassword ? eyeOffIcon : eyeIcon} width={24} height={24} />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("language")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={i18n.language}
            onValueChange={(value) => i18n.changeLanguage(value)}
            style={styles.picker}
            dropdownIconColor="#4e7397"
            mode="dropdown"
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="አማርኛ (Amharic)" value="am" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>{t("forgotPassword")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? t("loading") + "..." : t("loginButton")}
        </Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>{t("dontHaveAnAccount")}</Text>
        <TouchableOpacity onPress={() => router.push("/sign-up")}>
          <Text style={styles.signUpLink}>{t("signUp")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    ...(Platform.OS === "web" && {
      maxWidth: 400,
      marginHorizontal: "auto",
      width: "100%",
    }),
  },
  header: {
    paddingVertical: 16,
  },
  title: {
    color: "#0e141b",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
    paddingBottom: 12,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: "#e7edf3",
    borderRadius: 12,
    height: 56,
    padding: 16,
    fontSize: 16,
    color: "#0e141b",
  },
  inputError: {
    borderColor: "#ff4444",
    backgroundColor: "#fff8f8",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  eyeIconContainer: {
    height: 56,
    backgroundColor: "#e7edf3",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: "center",
    paddingRight: 16,
    paddingLeft: 12,
  },
  label: {
    color: "#0e141b",
    fontSize: 14,
    marginBottom: 8,
    ...(Platform.OS === "web" && {
      width: "auto",
      textAlign: "center",
      alignSelf: "center",
      fontSize: 16,
      paddingVertical: 5,
      color: "#333",
      marginHorizontal: "auto",
      maxWidth: 400, // Optional: Add max-width for better readability
      paddingHorizontal: 16 // Add side padding for smaller screens
    }),
  },
  pickerContainer: {
    backgroundColor: "#e7edf3",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    height: 56,
    color: "#0e141b",
  },
  forgotPassword: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  forgotPasswordText: {
    color: "#4e7397",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#1980e6",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
    width: 200,
    marginHorizontal: 80,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  signUpText: {
    color: "#4e7397",
    fontSize: 14,
  },
  signUpLink: {
    color: "#1980e6",
    fontSize: 14,
    marginLeft: 5,
    fontWeight: "500",
  },
});

export default LoginScreen;