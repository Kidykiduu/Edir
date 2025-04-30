 import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useRouter } from "expo-router";
import { useUserContext } from "../../src/contexts/UserContext";
import { useRegistrationContext } from "../../src/contexts/RegistrationContext";
import * as Font from 'expo-font';
import { useTranslation } from "react-i18next";
import SignaturePad from "../../src/components/SignaturePad";
import { RootLayoutContext } from '../_layout';
import { useContext } from 'react';

const arrowLeftIcon = `<svg xmlns="http:www.w3.org/2000/svg" width="24" height="24" fill="#0e141b" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>`;

const CustomCheckbox = ({ value, onValueChange, label }) => {
  return (
    <View style={styles.checkboxRow}>
      <TouchableOpacity
        style={[styles.customCheckbox, value ? styles.customCheckboxChecked : {}]}
        onPress={() => onValueChange(!value)}
      >
        {value && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      <Text style={[styles.checkboxLabel, { fontFamily: value ? "NotoSansEthiopic" : undefined }]}>
        {label}
      </Text>
    </View>
  );
};

const DashedInputField = ({ placeholder, value, onChangeText, style, error, ...props }) => {
  return (
    <View>
      <TextInput
        style={[styles.dashedInput, style, error ? styles.inputError : null]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        underlineColorAndroid="transparent"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const FamilyForm = () => {
  const { t } = useTranslation();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [formSubmissionStatus, setFormSubmissionStatus] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { hasSubmitted, setSubmissionStatus, isLoading: isLoadingGlobal } = useRegistrationContext();
  const { user, completeRegistration } = useUserContext();
  const { registrationData, clearRegistrationData } = useRegistrationContext();
  const router = useRouter();
  const [formData, setFormData] = useState({
    applicantName: user ? `${user.firstName} ${user.lastName}` : "",
    applicantPhone: user ? user.phone : "",
    applicantEmail: user ? user.email : "",
    applicantMemberId: "",
    spouseName: "",
    spousePhone: "",
    spouseEmail: "",
    spouseMemberId: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    homePhone: "",
    registrationType: null,
    familyMembers: [
      { name: "", gender: "", dob: "", relationship: "", memberId: "" },
      { name: "", gender: "", dob: "", relationship: "", memberId: "" },
      { name: "", gender: "", dob: "", relationship: "", memberId: "" },
      { name: "", gender: "", dob: "", relationship: "", memberId: "" },
      { name: "", gender: "", dob: "", relationship: "", memberId: "" },
    ],
    rep1NameAmharic: "",
    rep1DesigneeAmharic: "",
    rep1NameEnglish: "",
    rep1DesigneeEnglish: "",
    rep1Phone: "",
    rep1Email: "",
    rep1SignatureDate: "",
    rep2NameAmharic: "",
    rep2DesigneeAmharic: "",
    rep2NameEnglish: "",
    rep2DesigneeEnglish: "",
    rep2Phone: "",
    rep2Email: "",
    rep2SignatureDate: "",
    officialName: "",
    officialSignatureDate: "",
    applicantSignature: "",
    designee1Signature: "",
    designee2Signature: "",
    officialSignature: "",
    dateApplied: "",
  });
  const [errors, setErrors] = useState({});
  const [hasRedirected, setHasRedirected] = useState(false);
  const isRootReady = useContext(RootLayoutContext);

  useEffect(() => {
    async function loadFont() {
      try {
        await Font.loadAsync({
          NotoSansEthiopic: require('../../assets/fonts/NotoSansEthiopic-Regular.ttf'),
        });
        setFontLoaded(true);
      } catch (e) {
        console.error("Failed to load font:", e);
      }
    }
    loadFont();
  }, []);

  useEffect(() => {
    if (!isRootReady || isLoadingGlobal) return;
  
    const navigate = () => {
      if (hasSubmitted) {
        console.log("Redirecting to /sign-in");
        clearRegistrationData();
      } else if (!registrationData) {
        console.log("Redirecting to /sign-up");
        router.replace("/sign-up");
      }
    };
  
    navigate();
  }, [isRootReady, isLoadingGlobal, hasSubmitted, registrationData, router]);

  const validateDateFormat = (dateString) => {
    if (!dateString) return false;
    const regex = /^\d{2}\/\d{2}\/(\d{2}|\d{4})$/;
    if (!regex.test(dateString)) return false;
    const [month, day, year] = dateString.split('/').map(Number);
    const fullYear = year < 100 ? (year >= 50 ? 1900 + year : 2000 + year) : year;
    const date = new Date(fullYear, month - 1, day);
    return date.getMonth() + 1 === month && date.getDate() === day && date.getFullYear() === fullYear;
  };

  const validateForm = () => {
    const newErrors = {};
    const validationFailures = [];

    if (!registrationData?.username) {
      newErrors.username = t("usernameRequired");
      validationFailures.push("username is missing in registrationData");
    }
    if (!registrationData?.password) {
      newErrors.password = t("passwordRequired");
      validationFailures.push("password is missing in registrationData");
    }
    if (!formData.applicantName.trim()) {
      newErrors.applicantName = t("requiredField");
      validationFailures.push("applicantName is empty");
    }
    if (!formData.applicantPhone.trim()) {
      newErrors.applicantPhone = t("requiredField");
      validationFailures.push("applicantPhone is empty");
    } else if (!/^\+?\d{9,15}$/.test(formData.applicantPhone.replace(/\s/g, ""))) {
      newErrors.applicantPhone = t("invalidPhone");
      validationFailures.push("applicantPhone is invalid");
    }
    if (!formData.applicantEmail.trim()) {
      newErrors.applicantEmail = t("requiredField");
      validationFailures.push("applicantEmail is empty");
    } else if (!/\S+@\S+\.\S+/.test(formData.applicantEmail)) {
      newErrors.applicantEmail = t("invalidEmail");
      validationFailures.push("applicantEmail is invalid");
    }
    if (!formData.address.trim()) {
      newErrors.address = t("requiredField");
      validationFailures.push("address is empty");
    }
    if (!formData.city.trim()) {
      newErrors.city = t("requiredField");
      validationFailures.push("city is empty");
    }
    if (!formData.state.trim()) {
      newErrors.state = t("requiredField");
      validationFailures.push("state is empty");
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = t("requiredField");
      validationFailures.push("zipCode is empty");
    }
    if (!formData.registrationType) {
      newErrors.registrationType = t("requiredField");
      validationFailures.push("registrationType is not selected");
    }
    if (!formData.rep1NameEnglish.trim()) {
      newErrors.rep1NameEnglish = t("requiredField");
      validationFailures.push("rep1NameEnglish is empty");
    }
    if (!formData.rep1Phone.trim()) {
      newErrors.rep1Phone = t("requiredField");
      validationFailures.push("rep1Phone is empty");
    } else if (!/^\+?\d{9,15}$/.test(formData.rep1Phone.replace(/\s/g, ""))) {
      newErrors.rep1Phone = t("invalidPhone");
      validationFailures.push("rep1Phone is invalid");
    }
    if (!formData.rep1Email.trim()) {
      newErrors.rep1Email = t("requiredField");
      validationFailures.push("rep1Email is empty");
    } else if (!/\S+@\S+\.\S+/.test(formData.rep1Email)) {
      newErrors.rep1Email = t("invalidEmail");
      validationFailures.push("rep1Email is invalid");
    }
    if (!formData.rep1SignatureDate.trim()) {
      newErrors.rep1SignatureDate = t("requiredField");
      validationFailures.push("rep1SignatureDate is empty");
    } else if (!validateDateFormat(formData.rep1SignatureDate)) {
      newErrors.rep1SignatureDate = t("invalidDateFormat");
      validationFailures.push("rep1SignatureDate is invalid");
    }
    if (formData.rep2NameEnglish && !formData.rep2SignatureDate.trim()) {
      newErrors.rep2SignatureDate = t("requiredField");
      validationFailures.push("rep2SignatureDate is empty");
    } else if (formData.rep2SignatureDate && !validateDateFormat(formData.rep2SignatureDate)) {
      newErrors.rep2SignatureDate = t("invalidDateFormat");
      validationFailures.push("rep2SignatureDate is invalid");
    }
    if (formData.officialName && !formData.officialSignatureDate.trim()) {
      newErrors.officialSignatureDate = t("requiredField");
      validationFailures.push("officialSignatureDate is empty");
    } else if (formData.officialSignatureDate && !validateDateFormat(formData.officialSignatureDate)) {
      newErrors.officialSignatureDate = t("invalidDateFormat");
      validationFailures.push("officialSignatureDate is invalid");
    }

    formData.familyMembers.forEach((member, index) => {
      if (member.name.trim() && !member.dob.trim()) {
        newErrors[`familyMembers[${index}].dob`] = t("requiredField");
        validationFailures.push(`familyMembers[${index}].dob is empty`);
      } else if (member.dob && !validateDateFormat(member.dob)) {
        newErrors[`familyMembers[${index}].dob`] = t("invalidDateFormat");
        validationFailures.push(`familyMembers[${index}].dob is invalid`);
      }
    });

    if (validationFailures.length > 0) {
      console.log("Validation failed with issues:", validationFailures);
    } else {
      console.log("Validation passed successfully");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFamilyMember = (index, field, value) => {
    const updatedMembers = [...formData.familyMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData({ ...formData, familyMembers: updatedMembers });
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const [month, day, year] = dateString.split('/').map(Number);
    const fullYear = year < 100 ? (year >= 50 ? 1900 + year : 2000 + year) : year;
    const formattedDate = `${fullYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    console.log(`Formatting date: ${dateString} -> ${formattedDate}`);
    return formattedDate;
  };

  const submitForm = async () => {
    console.log('Submit button clicked');
    console.log('registrationData before submission:', registrationData);

    if (!acceptTerms) {
      console.log("Terms not accepted");
      Alert.alert(t("error"), t("mustAllowTerms"));
      return;
    }

    if (!validateForm()) {
      console.log("Form validation failed");
      Alert.alert(t("error"), t("fillRequiredFields"), [], { cancelable: true });
      setFormSubmissionStatus("failed");
      return;
    }

    setIsLoadingLocal(true);
    setFormSubmissionStatus("submitting");
    try {
      const apiData = {
        username: registrationData.username,
        password: registrationData.password,
        full_name: formData.applicantName,
        email: formData.applicantEmail,
        phone_number: formData.applicantPhone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        home_or_alternate_phone: formData.homePhone || null,
        registration_type: formData.registrationType,
        family_members: formData.familyMembers
          .filter((member) => member.name.trim() && member.dob.trim())
          .map((member) => ({
            full_name: member.name,
            gender: member.gender.toLowerCase() === 'm' ? 'male' : member.gender.toLowerCase() === 'f' ? 'female' : member.gender,
            date_of_birth: formatDate(member.dob),
            relationship: member.relationship,
          })),
        representatives: [
          {
            full_name: formData.rep1NameEnglish,
            phone_number: formData.rep1Phone,
            email: formData.rep1Email,
            date_of_designation: formatDate(formData.rep1SignatureDate),
          },
          formData.rep2NameEnglish
            ? {
                full_name: formData.rep2NameEnglish,
                phone_number: formData.rep2Phone || null,
                email: formData.rep2Email || null,
                date_of_designation: formatDate(formData.rep2SignatureDate) || null,
              }
            : null,
        ].filter((rep) => rep !== null),
      };

      if (formData.registrationType === "family" && formData.spouseName.trim()) {
        apiData.spouse = {
          full_name: formData.spouseName,
          email: formData.spouseEmail || null,
          phone_number: formData.spousePhone || null,
        };
      }

      console.log("API request to:", "https:noble.pythonanywhere.com/api/nobedir/members/create/");
      console.log("Payload:", JSON.stringify(apiData, null, 2));

      const response = await fetch("https:noble.pythonanywhere.com/api/nobedir/members/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        Alert.alert("Error", errorData.message || t("registrationFailed"));
        setFormSubmissionStatus("failed");
        return;
      }

      const data = await response.json();
      if(response.status == 200){
        router.replace("/sign-in")
        }
        
console.log("Response:", data);

// Update submission status first
await setSubmissionStatus(true); // Only if this is async
setFormSubmissionStatus("success");
completeRegistration(); // If this needs to be async, await it

// Clear data immediately
clearRegistrationData();

// Show alert with navigation callback
Alert.alert(
  "Success", 
  data.message || t("registrationSuccessful"),
  [
    { 
      text: "OK",
      onPress: async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        router.replace("/sign-in",{
          onRouteMatched: () => console.log("Navigation to sign-in completed"),
          onRouteError: (error) => console.error("Navigation error:", error)
        });
        console.log("Post-submission state:", {
          hasSubmitted: hasSubmitted,
          registrationData: registrationData,
          isRootReady: isRootReady
        });
      }
    }
  ]
  
);
    } catch (error) {
      console.error('Catch error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        Alert.alert(t("error"), t("networkError"));
      } else {
        Alert.alert(t("error"), error.message || t("unknownError"));
      }
      setFormSubmissionStatus("failed");
    } finally {
      setIsLoadingLocal(false);
    }
  };

  const handleBack = () => {
    router.push("/sign-up");
  };

  return isLoadingGlobal || isLoadingLocal ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>{t("loading")}</Text>
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={handleBack}>
        <SvgXml xml={arrowLeftIcon} width={24} height={24} />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={[styles.headerText, fontLoaded ? { fontFamily: "NotoSansEthiopic" } : {}]}>
              የአባልነት ምዝገባ ቅጽ
             </Text>
             <Text style={styles.headerText}>{t("membershipRegistrationForm")}</Text>
           </View>

           <View style={styles.section}>
             <View style={styles.sectionTitle}>
               <Text style={[styles.sectionTitleText, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                 {t("applicantInformation")} / የአመልካች መረጃ
               </Text>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("applicantFullName")} / የአመልካች ሙሉ ስም:
                 </Text>
                 <TextInput
                   style={[styles.input, errors.applicantName ? styles.inputError : null]}
                   value={formData.applicantName}
                   onChangeText={(text) => setFormData({ ...formData, applicantName: text })}
                   placeholder={t("enterFullName")}
                 />
                 {errors.applicantName && (
                   <Text style={styles.errorText}>{errors.applicantName}</Text>
                 )}
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("cellPhone")} / ሞባይል ስልክ ቁጥር:
                 </Text>
                 <TextInput
                   style={[styles.input, errors.applicantPhone ? styles.inputError : null]}
                   value={formData.applicantPhone}
                   onChangeText={(text) => setFormData({ ...formData, applicantPhone: text })}
                   keyboardType="phone-pad"
                   placeholder={t("enterPhoneNumber")}
                 />
                 {errors.applicantPhone && (
                   <Text style={styles.errorText}>{errors.applicantPhone}</Text>
                 )}
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("email")} / ኢሜይል:
                 </Text>
                 <TextInput
                   style={[styles.input, errors.applicantEmail ? styles.inputError : null]}
                   value={formData.applicantEmail}
                   onChangeText={(text) => setFormData({ ...formData, applicantEmail: text })}
                   keyboardType="email-address"
                   placeholder={t("enterEmailAddress")}
                 />
                 {errors.applicantEmail && (
                   <Text style={styles.errorText}>{errors.applicantEmail}</Text>
                 )}
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("memberId")} / የአባልነት መታወቂያ ቁጥር:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.applicantMemberId}
                   onChangeText={(text) => setFormData({ ...formData, applicantMemberId: text })}
                   placeholder={t("enterMemberId")}
                 />
               </View>
             </View>
           </View>

           <View style={styles.section}>
             <View style={styles.sectionTitle}>
               <Text style={[styles.sectionTitleText, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                 {t("residenceInformation")} / የመኖሪያ አድራሻ መረጃ
               </Text>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("residenceAddress")} / የመኖሪያ አድራሻ:
                 </Text>
                 <TextInput
                   style={[styles.input, errors.address ? styles.inputError : null]}
                   value={formData.address}
                   onChangeText={(text) => setFormData({ ...formData, address: text })}
                   placeholder={t("enterResidenceAddress")}
                 />
                 {errors.address && (
                   <Text style={styles.errorText}>{errors.address}</Text>
                 )}
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("city")} / ከተማ:
                 </Text>
                 <TextInput
                   style={[styles.input, errors.city ? styles.inputError : null]}
                   value={formData.city}
                   onChangeText={(text) => setFormData({ ...formData, city: text })}
                   placeholder={t("enterCity")}
                 />
                 {errors.city && (
                   <Text style={styles.errorText}>{errors.city}</Text>
                 )}
               </View>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("state")} / ስቴት:
                 </Text>
                 <TextInput
                   style={[styles.input, errors.state ? styles.inputError : null]}
                   value={formData.state}
                   onChangeText={(text) => setFormData({ ...formData, state: text })}
                   placeholder={t("enterState")}
                 />
                 {errors.state && (
                   <Text style={styles.errorText}>{errors.state}</Text>
                 )}
               </View>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("zipCode")} / ዚፕ ኮድ:
                 </Text>
                 <TextInput
                   style={[styles.input, errors.zipCode ? styles.inputError : null]}
                   value={formData.zipCode}
                   onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
                   keyboardType="numeric"
                   placeholder={t("enterZipCode")}
                 />
                 {errors.zipCode && (
                   <Text style={styles.errorText}>{errors.zipCode}</Text>
                 )}
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("homeOrAlternatePhone")} / የቤት ስልክ ወይም ሌላ ስልክ ቁጥር:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.homePhone}
                   onChangeText={(text) => setFormData({ ...formData, homePhone: text })}
                   keyboardType="phone-pad"
                   placeholder={t("enterHomePhone")}
                 />
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("registrationType")} / የምዝገባ አይነት:
                 </Text>
                 <View style={styles.checkboxContainer}>
                   <CustomCheckbox
                     value={formData.registrationType === "family"}
                     onValueChange={() => setFormData({ ...formData, registrationType: "family" })}
                     label={t("family")}
                   />
                   <CustomCheckbox
                     value={formData.registrationType === "single"}
                     onValueChange={() => setFormData({ ...formData, registrationType: "single" })}
                     label={t("single")}
                   />
                 </View>
                 {errors.registrationType && (
                   <Text style={styles.errorText}>{errors.registrationType}</Text>
                 )}
               </View>
             </View>
           </View>

           <View style={styles.section}>
             <View style={styles.sectionTitle}>
               <Text style={[styles.sectionTitleText, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                 {t("spouseInformation")} / የባለቤት መረጃ
               </Text>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("spouseFullName")} / የባለቤት ሙሉ ስም:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.spouseName}
                   onChangeText={(text) => setFormData({ ...formData, spouseName: text })}
                   placeholder={t("enterSpouseFullName")}
                 />
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("cellPhone")} / ሞባይል ስልክ ቁጥር:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.spousePhone}
                   onChangeText={(text) => setFormData({ ...formData, spousePhone: text })}
                   keyboardType="phone-pad"
                   placeholder={t("enterSpousePhoneNumber")}
                 />
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("email")} / ኢሜይል:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.spouseEmail}
                   onChangeText={(text) => setFormData({ ...formData, spouseEmail: text })}
                   keyboardType="email-address"
                   placeholder={t("enterSpouseEmailAddress")}
                 />
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("memberId")} / የአባልነት መታወቂያ ቁጥር:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.spouseMemberId}
                   onChangeText={(text) => setFormData({ ...formData, spouseMemberId: text })}
                   placeholder={t("enterSpouseMemberId")}
                 />
               </View>
             </View>
           </View>

         

           <View style={styles.section}>
             <View style={styles.sectionTitle}>
               <Text style={[styles.sectionTitleText, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                 {t("familyMembersToBeRegistered")} / የሚመዘገቡ የቤተሰብ አባላት
               </Text>
             </View>

             <View style={styles.tableContainer}>
               <View style={styles.tableHeader}>
                 <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>#</Text>
                 <Text style={[styles.tableHeaderCell, { flex: 2, fontFamily: fontLoaded ? "NotoSansEthiopic" : undefined }]}>
                   {t("fullName")} / ሙሉ ስም
                 </Text>
                 <Text style={[styles.tableHeaderCell, { flex: 1, fontFamily: fontLoaded ? "NotoSansEthiopic" : undefined }]}>
                   {t("maleFemale")} / ወንድ/ሴት
                 </Text>
                 <Text style={[styles.tableHeaderCell, { flex: 1.5, fontFamily: fontLoaded ? "NotoSansEthiopic" : undefined }]}>
                   {t("dateOfBirth")} / የልደት ቀን
                 </Text>
                 <Text style={[styles.tableHeaderCell, { flex: 1.5, fontFamily: fontLoaded ? "NotoSansEthiopic" : undefined }]}>
                   {t("relationship")} / ዝምድና
                 </Text>
                 <Text style={[styles.tableHeaderCell, { flex: 1.5, fontFamily: fontLoaded ? "NotoSansEthiopic" : undefined }]}>
                   {t("memberId")} / የአባልነት መታወቂያ
                 </Text>
               </View>

               {formData.familyMembers.map((member, index) => (
                 <View key={index} style={styles.tableRow}>
                   <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                   <DashedInputField
                     style={[styles.tableCell, { flex: 2 }]}
                     placeholder={t("enterFullName")}
                     value={member.name}
                     onChangeText={(text) => updateFamilyMember(index, "name", text)}
                   />
                   <DashedInputField
                     style={[styles.tableCell, { flex: 1 }]}
                     placeholder="M/F"
                     value={member.gender}
                     onChangeText={(text) => updateFamilyMember(index, "gender", text)}
                   />
                   <DashedInputField
                     style={[styles.tableCell, { flex: 1.5 }]}
                     placeholder="MM/DD/YY or MM/DD/YYYY"
                     value={member.dob}
                     onChangeText={(text) => updateFamilyMember(index, "dob", text)}
                     error={errors[`familyMembers[${index}].dob`]}
                   />
                   <DashedInputField
                     style={[styles.tableCell, { flex: 1.5 }]}
                     placeholder={t("enterRelationship")}
                     value={member.relationship}
                     onChangeText={(text) => updateFamilyMember(index, "relationship", text)}
                   />
                   <DashedInputField
                     style={[styles.tableCell, { flex: 1.5 }]}
                     placeholder={t("enterMemberId")}
                     value={member.memberId}
                     onChangeText={(text) => updateFamilyMember(index, "memberId", text)}
                   />
                 </View>
               ))}
             </View>
           </View>

           <View style={styles.section}>
             <View style={styles.sectionTitle}>
               <Text style={[styles.sectionTitleText, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                 {t("designatedRepresentative1")} / የተፈቀደለት ተወካይ 1
               </Text>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("nameInAmharic")} / ስም በአማርኛ:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.rep1NameAmharic}
                   onChangeText={(text) => setFormData({ ...formData, rep1NameAmharic: text })}
                   placeholder={t("enterNameInAmharic")}
                 />
               </View>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("designeeInAmharic")} / ተወካይ በአማርኛ:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.rep1DesigneeAmharic}
                   onChangeText={(text) => setFormData({ ...formData, rep1DesigneeAmharic: text })}
                   placeholder={t("enterDesigneeInAmharic")}
                 />
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("nameInEnglish")} / ስም በእንግሊዝኛ:
                 </Text>
                 <TextInput
                   style={[styles.input, errors.rep1NameEnglish ? styles.inputError : null]}
                   value={formData.rep1NameEnglish}
                   onChangeText={(text) => setFormData({ ...formData, rep1NameEnglish: text })}
                   placeholder={t("enterNameInEnglish")}
                 />
                 {errors.rep1NameEnglish && (
                   <Text style={styles.errorText}>{errors.rep1NameEnglish}</Text>
                 )}
               </View>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("designeeInEnglish")} / ተወካይ በእንግሊዝኛ:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.rep1DesigneeEnglish}
                   onChangeText={(text) => setFormData({ ...formData, rep1DesigneeEnglish: text })}
                   placeholder={t("enterDesigneeInEnglish")}
                 />
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("phone")} / ስልክ ቁጥር:
                 </Text>
                 <TextInput
                   style={[styles.input, errors.rep1Phone ? styles.inputError : null]}
                   value={formData.rep1Phone}
                   onChangeText={(text) => setFormData({ ...formData, rep1Phone: text })}
                   keyboardType="phone-pad"
                   placeholder={t("enterPhoneNumber")}
                 />
                 {errors.rep1Phone && (
                   <Text style={styles.errorText}>{errors.rep1Phone}</Text>
                 )}
               </View>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("email")} / ኢሜይል:
                 </Text>
                 <TextInput
                   style={[styles.input, errors.rep1Email ? styles.inputError : null]}
                   value={formData.rep1Email}
                   onChangeText={(text) => setFormData({ ...formData, rep1Email: text })}
                   keyboardType="email-address"
                   placeholder={t("enterEmailAddress")}
                 />
                 {errors.rep1Email && (
                   <Text style={styles.errorText}>{errors.rep1Email}</Text>
                 )}
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("signatureDate")} / የፊርማ ቀን:
                 </Text>
                 <TextInput
                   style={[styles.input, errors.rep1SignatureDate ? styles.inputError : null]}
                   value={formData.rep1SignatureDate}
                   onChangeText={(text) => setFormData({ ...formData, rep1SignatureDate: text })}
                   placeholder="MM/DD/YY or MM/DD/YYYY"
                 />
                 {errors.rep1SignatureDate && (
                   <Text style={styles.errorText}>{errors.rep1SignatureDate}</Text>
                 )}
               </View>
             </View>
           </View>

           <View style={styles.section}>
             <View style={styles.sectionTitle}>
               <Text style={[styles.sectionTitleText, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                 {t("designatedRepresentative2")} / የተፈቀደለት ተወካይ 2
               </Text>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("nameInAmharic")} / ስም በአማርኛ:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.rep2NameAmharic}
                   onChangeText={(text) => setFormData({ ...formData, rep2NameAmharic: text })}
                   placeholder={t("enterNameInAmharic")}
                 />
               </View>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("designeeInAmharic")} / ተወካይ በአማርኛ:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.rep2DesigneeAmharic}
                   onChangeText={(text) => setFormData({ ...formData, rep2DesigneeAmharic: text })}
                   placeholder={t("enterDesigneeInAmharic")}
                 />
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("nameInEnglish")} / ስም በእንግሊዝኛ:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.rep2NameEnglish}
                   onChangeText={(text) => setFormData({ ...formData, rep2NameEnglish: text })}
                   placeholder={t("enterNameInEnglish")}
                 />
               </View>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("designeeInEnglish")} / ተወካይ በእንግሊዝኛ:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.rep2DesigneeEnglish}
                   onChangeText={(text) => setFormData({ ...formData, rep2DesigneeEnglish: text })}
                   placeholder={t("enterDesigneeInEnglish")}
                 />
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("phone")} / ስልክ ቁጥር:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.rep2Phone}
                   onChangeText={(text) => setFormData({ ...formData, rep2Phone: text })}
                   keyboardType="phone-pad"
                   placeholder={t("enterPhoneNumber")}
                 />
               </View>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("email")} / ኢሜይል:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.rep2Email}
                   onChangeText={(text) => setFormData({ ...formData, rep2Email: text })}
                   keyboardType="email-address"
                   placeholder={t("enterEmailAddress")}
                 />
               </View>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("signatureDate")} / የፊርማ ቀን:
                 </Text>
                 <TextInput
                   style={[styles.input, errors.rep2SignatureDate ? styles.inputError : null]}
                   value={formData.rep2SignatureDate}
                   onChangeText={(text) => setFormData({ ...formData, rep2SignatureDate: text })}
                   placeholder="MM/DD/YY or MM/DD/YYYY"
                 />
                 {errors.rep2SignatureDate && (
                   <Text style={styles.errorText}>{errors.rep2SignatureDate}</Text>
                 )}
               </View>
             </View>
           </View>

           <View style={styles.section}>
             <View style={styles.sectionTitle}>
               <Text style={[styles.sectionTitleText, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                 {t("officialInformation")} / የባለስልጣን መረጃ
               </Text>
             </View>

             <View style={styles.row}>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("officialName")} / የባለስልጣን ስም:
                 </Text>
                 <TextInput
                   style={styles.input}
                   value={formData.officialName}
                   onChangeText={(text) => setFormData({ ...formData, officialName: text })}
                   placeholder={t("enterOfficialName")}
                 />
               </View>
               <View style={styles.col}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("signatureDate")} / የፊርማ ቀን:
                 </Text>
                 <TextInput
                   style={[styles.input, errors.officialSignatureDate ? styles.inputError : null]}
                   value={formData.officialSignatureDate}
                   onChangeText={(text) => setFormData({ ...formData, officialSignatureDate: text })}
                   placeholder="MM/DD/YY or MM/DD/YYYY"
                 />
                 {errors.officialSignatureDate && (
                   <Text style={styles.errorText}>{errors.officialSignatureDate}</Text>
                 )}
               </View>
             </View>
           </View>

           <View style={styles.section}>
             <View style={styles.sectionTitle}>
               <Text style={[styles.sectionTitleText, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                 {t("signatures")} / ፊርማዎች
               </Text>
             </View>

             <View style={styles.signatureRow}>
               <View style={styles.signatureCol}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic"} : {}]}>
                   {t("applicantSignature")} / የአመልካች ፊርማ:
                 </Text>
                 <SignaturePad
                   onSave={(signature) => setFormData({ ...formData, applicantSignature: signature })}
                 />
               </View>
               <View style={styles.signatureCol}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("designee1Signature")} / የተወካይ 1 ፊርማ:
                 </Text>
                 <SignaturePad
                   onSave={(signature) => setFormData({ ...formData, designee1Signature: signature })}
                 />
               </View>
             </View>

             <View style={styles.signatureRow}>
               <View style={styles.signatureCol}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("designee2Signature")} / የተወካይ 2 ፊርማ:
                 </Text>
                 <SignaturePad
                   onSave={(signature) => setFormData({ ...formData, designee2Signature: signature })}
                 />
               </View>
               <View style={styles.signatureCol}>
                 <Text style={[styles.label, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                   {t("officialSignature")} / የባለስልጣን ፊርማ:
                 </Text>
                 <SignaturePad
                   onSave={(signature) => setFormData({ ...formData, officialSignature: signature })}
                 />
               </View>
             </View>
           </View>

           <View style={styles.section}>
             <View style={styles.sectionTitle}>
               <Text style={[styles.sectionTitleText, fontLoaded ? { fontFamily: "NotoSansEthiopic" }: {}]}>
                 {t("TermsAndConditions")} / ውሎች እና መመሪያዎች
               </Text>
             </View>
             <CustomCheckbox
               value={acceptTerms}
               onValueChange={setAcceptTerms}
               label={t("AcceptTerms/ውሎችን እና መመሪያዎችን እቀበላለሁ")}
             />
           </View>

           <TouchableOpacity
             style={[styles.submitButton, isLoadingLocal? styles.submitButtonDisabled : {}]}
             onPress={submitForm}
             disabled={isLoadingLocal}
           >
             <Text style={styles.submitButtonText}>
               {isLoadingLocal ? t("submitting") : t("signUpAccept")} / ይቀበሉ እና ይመዝገቡ
             </Text>
           </TouchableOpacity>

           {/* Submission Status Indicator */}
           {formSubmissionStatus && (
             <View style={styles.statusContainer}>
               <Text
                 style={[
                   styles.statusText,
                   formSubmissionStatus === "success" ? styles.statusSuccess : formSubmissionStatus === "failed" ? styles.statusFailed : styles.statusSubmitting,
                 ]}
               >
                 {formSubmissionStatus === "success"
                   ? t("submissionSuccess")
                   : formSubmissionStatus === "failed"
                   ? t("submissionFailed")
                   : t("submitting")}
               </Text>
             </View>
           )}
         </View>
       </ScrollView>
     </SafeAreaView>
   );
 };

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: "#e0f7f5",
     marginTop: -40,
   },
   backArrow: {
     padding: Platform.OS === "web" ? 16 : 12,
     marginTop: Platform.OS === "ios" ? 0 : 40,
   },
   formContainer: {
     padding: Platform.OS === "web" ? 32 : 16,
   },
   header: {
     backgroundColor: "#b3e6e0",
     padding: 12,
     alignItems: "center",
     marginBottom: 16,
     borderRadius: 4,
   },
   headerText: {
     fontSize: Platform.OS === "web" ? 24 : 18,
     fontWeight: "bold",
   },
   section: {
     backgroundColor: "#fff",
     borderRadius: 4,
     padding: 12,
     marginBottom: 16,
     borderWidth: 1,
     borderColor: "#b3e6e0",
   },
   sectionTitle: {
     backgroundColor: "#e0f7f5",
     padding: 8,
     alignItems: "center",
     marginBottom: 12,
     borderRadius: 4,
   },
   sectionTitleText: {
     fontSize: Platform.OS === "web" ? 18 : 16,
     fontWeight: "bold",
   },
   row: {
     flexDirection: Platform.OS === "web" ? "row" : "column",
     marginBottom: 12,
   },
   col: {
     flex: 1,
     paddingHorizontal: Platform.OS === "web" ? 8 : 0,
   },
   label: {
     marginBottom: 6,
     fontSize: 14,
     fontWeight: "500",
   },
   input: {
     borderWidth: 1,
     borderColor: "#ccc",
     borderRadius: 4,
     padding: 10,
     backgroundColor: "#fff",
     minHeight: 40,
     marginBottom: 8,
   },
   inputError: {
     borderColor: "#ef4444",
   },
   errorText: {
     color: "#ef4444",
     fontSize: 12,
     marginBottom: 8,
   },
   checkboxContainer: {
     flexDirection: "row",
     justifyContent: "space-between",
   },
   checkboxRow: {
     flexDirection: "row",
     alignItems: "center",
     marginBottom: 8,
   },
   customCheckbox: {
     width: 24,
     height: 24,
     borderWidth: 2,
     borderColor: "#2a9d8f",
     borderRadius: 4,
     justifyContent: "center",
     alignItems: "center",
     marginRight: 8,
   },
   customCheckboxChecked: {
     backgroundColor: "#2a9d8f",
   },
   checkmark: {
     color: "#fff",
     fontSize: 16,
     fontWeight: "bold",
   },
   checkboxLabel: {
     fontSize: 14,
   },
   tableContainer: {
     borderWidth: 1,
     borderColor: "#ccc",
     borderRadius: 4,
   },
   tableHeader: {
     flexDirection: "row",
     backgroundColor: "#e0f7f5",
     padding: 8,
     borderBottomWidth: 1,
     borderBottomColor: "#ccc",
   },
   tableHeaderCell: {
     fontSize: 12,
     fontWeight: "bold",
     textAlign: "center",
   },
   tableRow: {
     flexDirection: "row",
     padding: 8,
     borderBottomWidth: 1,
     borderBottomColor: "#eee",
   },
   tableCell: {
     fontSize: 12,
     textAlign: "center",
   },
   dashedInput: {
     borderWidth: 0,
     borderBottomWidth: 1,
     borderStyle: "dashed",
     borderColor: "#ccc",
     padding: 4,
     fontSize: 12,
     textAlign: "center",
   },
   signatureRow: {
     flexDirection: Platform.OS === "web" ? "row" : "column",
     marginBottom: 12,
   },
   signatureCol: {
     flex: 1,
     paddingHorizontal: Platform.OS === "web" ? 8 : 0,
     marginBottom: Platform.OS === "web" ? 0 : 16,
   },
   submitButton: {
     backgroundColor: "#2a9d8f",
     padding: 16,
     borderRadius: 4,
     alignItems: "center",
     marginTop: 16,
   },
   submitButtonDisabled: {
     backgroundColor: "#a0a0a0",
   },
   submitButtonText: {
     color: "#fff",
     fontWeight: "bold",
     fontSize: 16,
   },
   statusContainer: {
     marginTop: 16,
     alignItems: "center",
   },
   statusText: {
     fontSize: 16,
     fontWeight: "bold",
   },
   statusSuccess: {
     color: "#2a9d8f",
   },
   statusFailed: {
     color: "#ef4444",
   },
 statusSubmitting: {
    color: "#4e7397",
   },
}); 
export default FamilyForm;