
import React, { useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Platform } from "react-native";
import SignatureCanvas from "react-native-signature-canvas";
import WebSignatureCanvas from "react-signature-canvas";

const SignaturePad = ({
  onSave,
  height = 200,
  containerStyle,
  signatureContainerStyle,
  clearButtonStyle,
  clearButtonTextStyle,
}) => {
  const signatureRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleSignature = (signature) => {
    onSave(signature);
    setIsEmpty(signature === "");
  };

  const handleClear = () => {
    if (Platform.OS === "web") {
      signatureRef.current.clear();
      onSave("");
      setIsEmpty(true);
    } else {
      signatureRef.current.clearSignature();
      onSave("");
      setIsEmpty(true);
    }
  };

  const handleEnd = () => {
    if (Platform.OS === "web") {
      const signature = signatureRef.current.isEmpty()
        ? ""
        : signatureRef.current.toDataURL();
      handleSignature(signature);
    } else {
      signatureRef.current.readSignature();
    }
  };

  const webStyle = {
    border: "1px solid #d1d5db",
    borderRadius: 4,
    backgroundColor: "white",
    width: "100%",
    height: height,
  };

  const nativeStyle = `.m-signature-pad { box-shadow: none; border: none; } 
    .m-signature-pad--body { border: none; }
    .m-signature-pad--footer { display: none; margin: 0px; }
    body,html { height: ${height}px; width: 100%; }`;

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.signatureContainer,
          { height },
          signatureContainerStyle,
        ]}
      >
        {Platform.OS === "web" ? (
          <WebSignatureCanvas
            ref={signatureRef}
            canvasProps={{ style: webStyle, height, width: "100%" }}
            onEnd={handleEnd}
            backgroundColor="white"
            penColor="black"
          />
        ) : (
          <SignatureCanvas
            ref={signatureRef}
            onOK={handleSignature}
            onEmpty={() => handleSignature("")}
            onEnd={handleEnd}
            webStyle={nativeStyle}
            penColor="black"
            backgroundColor="white"
            autoClear={false}
            descriptionText=""
            clearText=""
            confirmText=""
          />
        )}
      </View>
      <TouchableOpacity
        style={[styles.clearButton, clearButtonStyle]}
        onPress={handleClear}
      >
        <Text style={[styles.clearButtonText, clearButtonTextStyle]}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
  },
  signatureContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "white",
    borderRadius: 4,
  },
  clearButton: {
    alignSelf: "flex-end",
    padding: 8,
    marginTop: 4,
  },
  clearButtonText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default SignaturePad;