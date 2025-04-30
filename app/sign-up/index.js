// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Platform,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { SvgXml } from "react-native-svg";
// import { useTranslation } from "react-i18next";
// import { useRouter } from "expo-router";
// import { useUserContext } from "../src/contexts/UserContext";
// import { useRegistrationContext } from "../src/contexts/RegistrationContext";

// // SVG icons
// const arrowLeftIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0e141b" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>`;

// const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4e7397" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/></svg>`;

// const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4e7397" viewBox="0 0 256 256"><path d="M53.92,34.62a8,8,0,1,0-11.84,10.76l19.24,21.17C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76ZM128,192c-23.31,0-44.56-6.19-62.25-16.3a134.18,134.18,0,0,0,24.17-18.72l18.74,20.61a40,40,0,1,0,35.2-35.2l16.07,17.67A80.17,80.17,0,0,1,128,192ZM74.08,93.22,99.15,118.3a40,40,0,0,0,42.55,42.55l17.55,19.31A80.46,80.46,0,0,1,128,160a80.08,80.08,0,0,1-80-80A79.34,79.34,0,0,1,74.08,93.22ZM245.2,124.76c-.35-.79-8.82-19.57-27.65-38.4-23.35-23.35-50.77-35-81.74-35.85a8,8,0,0,0-8.81,8.8c.81,31,12.5,58.41,35.85,81.75,18.83,18.83,37.61,27.3,38.4,27.65a8,8,0,0,0,6.5,0C247.26,147.47,247.26,129.06,245.2,124.76ZM165.1,152.47a8,8,0,0,1-2.32,5.53L150.47,165.1a8,8,0,0,1-11.31-11.31l12.31-12.31a8,8,0,0,1,11.31,0A8,8,0,0,1,165.1,152.47Z"/></svg>`;

// const SignUpScreen = () => {
//   const { t, i18n } = useTranslation();
//   const { setUser } = useUserContext();
//   const { setRegistrationData } = useRegistrationContext();
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     userName: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     language: i18n.language || "en",
//   });
//   const [errors, setErrors] = useState({
//     userName: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//   });

//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = {
//       userName: "",
//       firstName: "",
//       lastName: "",
//       email: "",
//       phone: "",
//       password: "",
//     };

//     if (!formData.userName.trim()) {
//       newErrors.userName = t("usernameRequired");
//       isValid = false;
//     }
//     if (!formData.firstName.trim()) {
//       newErrors.firstName = t("firstNameRequired");
//       isValid = false;
//     }
//     if (!formData.lastName.trim()) {
//       newErrors.lastName = t("lastNameRequired");
//       isValid = false;
//     }
//     if (!formData.email.trim()) {
//       newErrors.email = t("requiredField");
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = t("invalidEmail");
//       isValid = false;
//     }
//     if (!formData.phone.trim()) {
//       newErrors.phone = t("requiredField");
//       isValid = false;
//     } else if (!/^\+?\d{9,15}$/.test(formData.phone.replace(/\s/g, ""))) {
//       newErrors.phone = t("invalidPhone");
//       isValid = false;
//     }
//     if (!formData.password) {
//       newErrors.password = t("requiredField");
//       isValid = false;
//     } else if (formData.password.length < 8) {
//       newErrors.password = t("passwordLengthError");
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleNext = async () => {
//     if (!validateForm()) return;

//     try {
//       const newUser = {
//         userName: formData.userName,
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         phone: formData.phone,
//         hasCompletedRegistration: false,
//         role: "RegularUser",
//       };
//       setUser(newUser);
//       setRegistrationData({ userName: formData.userName, password: formData.password });
//       router.push("/family-form");
//     } catch (error) {
//       console.error("Signup failed:", error);
//       alert(t("signupFailed"));
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//   <TouchableOpacity style={styles.header} onPress={() => router.back()}>
//     <SvgXml xml={arrowLeftIcon} width={24} height={24} />
//   </TouchableOpacity>

//       <Text style={styles.title}>{t("signUp")}</Text>

//   <View style={styles.formContainer}>
//       <FormField
//         label={t("userName")}
//         value={formData.userName}
//         onChangeText={(text) => setFormData({ ...formData, userName: text })}
//         placeholder={t("usernamePlaceholder")}
//         error={errors.userName}
//         textInputProps={{
//           autoCapitalize: "none",
//         }}
//       /></View>

//       {/* Add this for First/Last Name row */}
// <View style={styles.rowContainer}>
//   <View style={[styles.inputContainer, styles.halfInputContainer]}>
//     <FormField
//       label={t("firstName")}
//       value={formData.firstName}
//       onChangeText={(text) => setFormData({ ...formData, firstName: text })}
//       placeholder={t("firstNamePlaceholder")}
//       error={errors.firstName}
//     />
//   </View>
  
//   <View style={[styles.inputContainer, styles.halfInputContainer]}>
//     <FormField
//       label={t("lastName")}
//       value={formData.lastName}
//       onChangeText={(text) => setFormData({ ...formData, lastName: text })}
//       placeholder={t("lastNamePlaceholder")}
//       error={errors.lastName}
//     />
//   </View>
// </View>

// <FormField
//   label={t("emailAddress")}
//   value={formData.email}
//   onChangeText={(text) => setFormData({ ...formData, email: text })}
//   placeholder={t("emailAddressPlaceholder")}
//   textInputProps={{
//     keyboardType: "email-address",
//     autoCapitalize: "none",
//   }}
//   error={errors.email}
// />

//       <FormField
//         label={t("phoneNumber")}
//         value={formData.phone}
//         onChangeText={(text) => setFormData({ ...formData, phone: text })}
//         placeholder={t("phoneNumberPlaceholder")}
//         textInputProps={{
//           keyboardType: "phone-pad",
//           maxLength: 15,
//         }}
//         error={errors.phone}
//       />

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>{t("password")}</Text>
//         <View style={styles.passwordInputWrapper}>
//           <TextInput
//             style={[styles.input, styles.passwordInput, errors.password ? styles.inputError : null]}
//             placeholder={t("password")}
//             value={formData.password}
//             onChangeText={(text) => setFormData({ ...formData, password: text })}
//             secureTextEntry={!showPassword}
//             autoCapitalize="none"
//           />
//           <TouchableOpacity
//             style={styles.eyeIconContainer}
//             onPress={togglePasswordVisibility}
//             hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
//           >
//             <SvgXml xml={showPassword ? eyeOffIcon : eyeIcon} width={24} height={24} />
//           </TouchableOpacity>
//         </View>
//         {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>{t("language")}</Text>
//         <View style={styles.pickerContainer}>
//           <Picker
//             selectedValue={formData.language}
//             onValueChange={(value) => {
//               setFormData({ ...formData, language: value });
//               i18n.changeLanguage(value);
//             }}
//             style={styles.picker}
//             dropdownIconColor="#4e7397"
//             mode="dropdown"
//           >
//             <Picker.Item label="English" value="en" />
//             <Picker.Item label="አማርኛ (Amharic)" value="am" />
//           </Picker>
//         </View>
//       </View>

//       <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
//         <Text style={styles.buttonText}>{t("next")}</Text>
//       </TouchableOpacity>

//       <View style={styles.loginLink}>
//         <Text style={styles.alreadyHaveAccountText}>{t("alreadyHaveAccount")}</Text>
//         <TouchableOpacity onPress={() =>{console.log("Navigating to /sign-in"); router.push("/sign-in");}} >
//           <Text style={styles.linkText}>{t("SignIn")}</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const FormField = ({ label, value, onChangeText, placeholder, textInputProps = {}, error }) => (
//   <View style={styles.inputContainer}>
//     <Text style={styles.label}>{label}</Text>
//     <TextInput
//       style={[styles.input, error ? styles.inputError : null]}
//       value={value}
//       onChangeText={onChangeText}
//       placeholder={placeholder}
//       placeholderTextColor="#4e7397"
//       {...textInputProps}
//     />
//     {error ? <Text style={styles.errorText}>{error}</Text> : null}
//   </View>
// );


//  const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8fafc",
//     paddingHorizontal: Platform.select({
//       web: 24,
//       default: 16,
//     }),
//     // Remove any maxWidth constraints from container
//   },
//   title: {
//     color: "#0e141b",
//     fontSize: Platform.select({
//       web: 32,
//       default: 22,
//     }),
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 20,
//   },
//   // Add new form container
//   formContainer: {
//     ...(Platform.OS === "web" && {
//       width: "100%",
//       maxWidth: 600,
//       marginHorizontal: "auto",
//       paddingHorizontal: 24,
//     }),
//   },
//   inputContainer: {
//     marginBottom: 16,
//     ...(Platform.OS === "web" && {
//       width: "100%",
//     }),
//   },
//   label: {
//     color: "#0e141b",
//     fontSize: 16,
//     fontWeight: "500",
//     marginBottom: 8,
//     ...(Platform.OS === "web" && {
//       textAlign: "center",
//       width: "100%",
//     }),
//   },
//   rowContainer: {
//     ...(Platform.OS === "web" && {
//       flexDirection: "row",
//       gap: 20,
//       width: "100%",
//     }),
//   },
//   halfInputContainer: {
//     ...(Platform.OS === "web" && {
//       flex: 1,
//     }),
//   },
//   input: {
//     backgroundColor: "#f8fafc",
//     borderWidth: 1,
//     borderColor: "#d0dbe7",
//     borderRadius: 12,
//     height: 56,
//     padding: 16,
//     fontSize: 16,
//     ...(Platform.OS === "web" && {
//       width: "100%",
//     }),
//   },
//   submitButton: {
//     backgroundColor: "#1976D2",
//     borderRadius: 12,
//     height: 48,
//     justifyContent: "center",
//     alignItems: "center",
//     marginVertical: 16,
//     alignSelf: "center",
//     width: Platform.select({
//       web: "100%",
//       default: "100%",
//     }),
//     maxWidth: Platform.select({
//       web: 600,
//       default: 200,
//     }),
//   },


//   // Keep all mobile styles exactly as they were
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 5,
//     marginTop: Platform.OS === "ios" ? 0 : 40,
//   },
//   inputError: {
//     borderColor: "#ef4444",
//   },
//   errorText: {
//     color: "#ef4444",
//     fontSize: 14,
//     marginTop: 4,
//   },
//   passwordInput: {
//     flex: 1,
//     borderRightWidth: 0,
//     borderTopRightRadius: 0,
//     borderBottomRightRadius: 0,
//   },
//   eyeIconContainer: {
//     height: 56,
//     borderWidth: 1,
//     borderColor: "#d0dbe7",
//     borderLeftWidth: 0,
//     borderTopRightRadius: 12,
//     borderBottomRightRadius: 12,
//     justifyContent: "center",
//     paddingRight: 16,
//     backgroundColor: "#f8fafc",
//   },
//   pickerContainer: {
//     backgroundColor: "#e7edf3",
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   picker: {
//     height: 56,
//     color: "#0e141b",
//     paddingHorizontal: 16,
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   loginLink: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   alreadyHaveAccountText: {
//     color: "#4e7397",
//     fontSize: 14,
//   },
//   linkText: {
//     color: "#1980e6",
//     fontSize: 14,
//     fontWeight: "bold",
//     marginLeft: 4,
//   },
// });
// export default SignUpScreen;

import React, { useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { SvgXml } from "react-native-svg";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { useUserContext } from "../../src/contexts/UserContext";
import { useRegistrationContext } from "../../src/contexts/RegistrationContext";

// SVG icons
const arrowLeftIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0e141b" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>`;

const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4e7397" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/></svg>`;

const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4e7397" viewBox="0 0 256 256"><path d="M53.92,34.62a8,8,0,1,0-11.84,10.76l19.24,21.17C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76ZM128,192c-23.31,0-44.56-6.19-62.25-16.3a134.18,134.18,0,0,0,24.17-18.72l18.74,20.61a40,40,0,1,0,35.2-35.2l16.07,17.67A80.17,80.17,0,0,1,128,192Zm-53.92-98.78,25.07,25.08a40,40,0,0,0,42.55,42.55l17.55,19.31A80.46,80.46,0,0,1,128,160a80.08,80.08,0,0,1-80-80A79.34,79.34,0,0,1,74.08,93.22ZM245.2,124.76c-.35-.79-8.82-19.57-27.65-38.4-23.35-23.35-50.77-35-81.74-35.85a8,8,0,0,0-8.81,8.8c.81,31,12.5,58.41,35.85,81.75,18.83,18.83,37.61,27.3,38.4,27.65a8,8,0,0,0,6.5,0C247.26,147.47,247.26,129.06,245.2,124.76ZM165.1,152.47a8,8,0,0,1-2.32,5.53L150.47,165.1a8,8,0,0,1-11.31-11.31l12.31-12.31a8,8,0,0,1,11.31,0A8,8,0,0,1,165.1,152.47Z"/></svg>`;

const SignUpScreen = () => {
  const { t, i18n } = useTranslation();
  const { setUser } = useUserContext();
  const { setRegistrationData } = useRegistrationContext();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    language: i18n.language || "en",
  });
  const [errors, setErrors] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    };

    if (!formData.username.trim()) {
      newErrors.username = t("usernameRequired");
      isValid = false;
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = t("firstNameRequired");
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t("lastNameRequired");
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = t("requiredField");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("invalidEmail");
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("requiredField");
      isValid = false;
    } else if (!/^\+?\d{9,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = t("invalidPhone");
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = t("requiredField");
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = t("passwordLengthError");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      Alert.alert(t("error"), t("fillRequiredFields"));
      return;
    }

    try {
      const newUser = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        hasCompletedRegistration: false,
        role: "RegularUser",
      };
      console.log("Setting user:", newUser);
      setUser(newUser);

      const registrationData = { username: formData.username, password: formData.password };
      console.log("Setting registrationData:", registrationData);
      setRegistrationData(registrationData);

      console.log("Navigating to /family-form");
      router.push("/family-form");
    } catch (error) {
      console.error("Signup failed:", error);
      Alert.alert(t("error"), error.message || t("signupFailed"));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => router.back()}>
        <SvgXml xml={arrowLeftIcon} width={24} height={24} />
      </TouchableOpacity>

      <Text style={styles.title}>{t("signUp")}</Text>

      <View style={styles.formContainer}>
        <FormField
          label={t("username")}
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
          placeholder={t("usernamePlaceholder")}
          error={errors.username}
          textInputProps={{
            autoCapitalize: "none",
          }}
        />
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.inputContainer, styles.halfInputContainer]}>
          <FormField
            label={t("firstName")}
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            placeholder={t("firstNamePlaceholder")}
            error={errors.firstName}
          />
        </View>

        <View style={[styles.inputContainer, styles.halfInputContainer]}>
          <FormField
            label={t("lastName")}
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            placeholder={t("lastNamePlaceholder")}
            error={errors.lastName}
          />
        </View>
      </View>

      <FormField
        label={t("emailAddress")}
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        placeholder={t("emailAddressPlaceholder")}
        textInputProps={{
          keyboardType: "email-address",
          autoCapitalize: "none",
        }}
        error={errors.email}
      />

      <FormField
        label={t("phoneNumber")}
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
        placeholder={t("phoneNumberPlaceholder")}
        textInputProps={{
          keyboardType: "phone-pad",
          maxLength: 15,
        }}
        error={errors.phone}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("password")}</Text>
        <View style={styles.passwordInputWrapper}>
          <TextInput
            style={[styles.input, styles.passwordInput, errors.password ? styles.inputError : null]}
            placeholder={t("password")}
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
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
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("language")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.language}
            onValueChange={(value) => {
              setFormData({ ...formData, language: value });
              i18n.changeLanguage(value);
            }}
            style={styles.picker}
            dropdownIconColor="#4e7397"
            mode="dropdown"
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="አማርኛ (Amharic)" value="am" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
        <Text style={styles.buttonText}>{t("next")}</Text>
      </TouchableOpacity>

      <View style={styles.loginLink}>
        <Text style={styles.alreadyHaveAccountText}>{t("alreadyHaveAccount")}</Text>
        <TouchableOpacity
          onPress={() => {
            console.log("Navigating to /sign-in");
            router.push("/sign-in");
          }}
        >
          <Text style={styles.linkText}>{t("SignIn")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const FormField = ({ label, value, onChangeText, placeholder, textInputProps = {}, error }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error ? styles.inputError : null]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#4e7397"
      {...textInputProps}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: Platform.select({
      web: 24,
      default: 16,
    }),
    // Remove any maxWidth constraints from container
  },
  title: {
    color: "#0e141b",
    fontSize: Platform.select({
      web: 32,
      default: 22,
    }),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  // Add new form container
  formContainer: {
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 600,
      marginHorizontal: "auto",
      paddingHorizontal: 24,
    }),
  },
  inputContainer: {
    marginBottom: 16,
    ...(Platform.OS === "web" && {
      width: "100%",
    }),
  },
  label: {
    color: "#0e141b",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    ...(Platform.OS === "web" && {
      textAlign: "center",
      width: "100%",
    }),
  },
  rowContainer: {
    ...(Platform.OS === "web" && {
      flexDirection: "row",
      gap: 20,
      width: "100%",
    }),
  },
  halfInputContainer: {
    ...(Platform.OS === "web" && {
      flex: 1,
    }),
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#d0dbe7",
    borderRadius: 12,
    height: 56,
    padding: 16,
    fontSize: 16,
    ...(Platform.OS === "web" && {
      width: "100%",
    }),
  },
  submitButton: {
    backgroundColor: "#1976D2",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    alignSelf: "center",
    width: Platform.select({
      web: "100%",
      default: "100%",
    }),
    maxWidth: Platform.select({
      web: 600,
      default: 200,
    }),
  },


  // Keep all mobile styles exactly as they were
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    marginTop: Platform.OS === "ios" ? 0 : 40,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 4,
  },
  passwordInput: {
    flex: 1,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  eyeIconContainer: {
    height: 56,
    borderWidth: 1,
    borderColor: "#d0dbe7",
    borderLeftWidth: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: "center",
    paddingRight: 16,
    backgroundColor: "#f8fafc",
  },
  pickerContainer: {
    backgroundColor: "#e7edf3",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    height: 56,
    color: "#0e141b",
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  alreadyHaveAccountText: {
    color: "#4e7397",
    fontSize: 14,
  },
  linkText: {
    color: "#1980e6",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default SignUpScreen;