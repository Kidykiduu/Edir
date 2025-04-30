import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = () => {
  // Animation values
  const imageAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const starsAnim = useRef(new Animated.Value(0)).current;

  // Star positions (example; expand as needed)
  const starPositions = [
    { top: height * 0.1, left: width * 0.15, size: 32 },
    { top: height * 0.15, left: width * 0.8, size: 28 },
    { top: height * 0.3, left: width * 0.3, size: 30 },
    { top: height * 0.4, left: width * 0.9, size: 26 },
  ];

  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(starsAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const Star = ({ position }) => (
    <Animated.View
      style={[
        styles.star,
        position,
        {
          opacity: starsAnim,
          transform: [
            {
              scale: starsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
            {
              translateY: starsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={{ fontSize: position.size, color: "#FFD700" }}>✦</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Stars */}
      {starPositions.map((pos, index) => (
        <Star key={index} position={pos} />
      ))}

      {/* Image with fixed size and proper animation */}
      <Animated.View
        style={[
          styles.circleContainer,
          {
            opacity: imageAnim,
            transform: [
              {
                translateX: imageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-width * 0.3, 0],
                }),
              },
              {
                translateY: imageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-height * 0.2, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Image
          source={require("../assets/images/as-a-team.jpg")}
          style={styles.circularImage}
        />
      </Animated.View>

      {/* Title */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: titleAnim,
            transform: [
              {
                translateX: titleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width * 0.3, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>In Times of Need, We Stand Together</Text>
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentAnim,
            transform: [
              {
                translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height * 0.2, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.description}>
          Welcome to EDIR, a mutual aid app that makes it easy for you to help and
          be helped by your community.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/sign-in")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    position: 'relative',
    paddingHorizontal: Platform.OS === 'web' ? '10%' : 20,
  },
  circleContainer: {
    marginTop: Platform.OS === 'web' ? 100 :150,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  circularImage: {
    width: Platform.OS === 'web' ? 300 : 250,
    height: Platform.OS === 'web' ? 300 : 250,
    borderRadius: 205,
    borderWidth: 5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  star: {
    position: 'absolute',
    color: '#26F1FF',
    textShadowColor: 'rgba(255, 215, 0, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    marginTop: -150,
  },
  title: {
    fontSize: Platform.OS === 'web' ? 32 : 24,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 32,
    ...(Platform.OS === "web" && {  
      maxWidth: "100%", 
    
    }),
  },
  content: {
    alignItems: "center",
    ...(Platform.OS === "web" && {  
      Width: "60%", 
    
    }),
  },
  description: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: "#34495e",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
    ...(Platform.OS === "web" && {  
      maxWidth: "80%", }),
  },
  button: {
    backgroundColor: "#1980e6",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.8,
  },
  // ... keep the rest of your styles unchanged
});

export default WelcomeScreen;