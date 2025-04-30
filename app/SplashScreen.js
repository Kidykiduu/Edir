import React, { useEffect, useRef, useState } from "react";
import { Animated, View, Image, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreenComponent() {
  const heartY = useRef(new Animated.Value(-500)).current;
  const heartX = useRef(new Animated.Value(0)).current;
  const textX = useRef(new Animated.Value(0)).current;
  const imageFade = useRef(new Animated.Value(1)).current;
  const textFade = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const [retracting, setRetracting] = useState(false);

  useEffect(() => {
    const triggerRetraction = Animated.timing(new Animated.Value(0), {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    });

    Animated.sequence([
      Animated.spring(heartY, { toValue: 0, friction: 5, tension: 40, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(heartX, { toValue: -50, friction: 5, useNativeDriver: true }),
        Animated.spring(textX, { toValue: 50, friction: 5, useNativeDriver: true }),
      ]),
      triggerRetraction,
      Animated.parallel([
        Animated.spring(heartX, { toValue: 0, friction: 5, useNativeDriver: true }),
        Animated.spring(textX, { toValue: 0, friction: 5, useNativeDriver: true }),
      ]),
      Animated.timing(textFade, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(imageFade, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    triggerRetraction.start(() => setRetracting(true));
  }, []);

  return (
    <LinearGradient colors={["#FFFFFF", "#999999"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      {!retracting ? (
        <>
          <Animated.View style={[styles.heartContainer, { transform: [{ translateY: heartY }, { translateX: heartX }], opacity: imageFade, zIndex: 2 }]}>
            <Image source={require("../assets/images/heart.png")} style={styles.heart} />
          </Animated.View>
          <Animated.View style={[styles.textContainer, { opacity: Animated.multiply(textOpacity, textFade), transform: [{ translateX: textX }, { translateY: heartY }], zIndex: 1 }]}>
            <Text style={styles.text}>EDIR</Text>
          </Animated.View>
        </>
      ) : (
        <>
          <Animated.View style={[styles.textContainer, { opacity: Animated.multiply(textOpacity, textFade), transform: [{ translateX: textX }, { translateY: heartY }], zIndex: 1 }]}>
            <Text style={styles.text}>EDIR</Text>
          </Animated.View>
          <Animated.View style={[styles.heartContainer, { transform: [{ translateY: heartY }, { translateX: heartX }], opacity: imageFade, zIndex: 2 }]}>
            <Image source={require("../assets/images/heart.png")} style={styles.heart} />
          </Animated.View>
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  heartContainer: { position: "absolute" },
  textContainer: { position: "absolute", flexDirection: "row", alignItems: "center" },
  heart: { width: 150, height: 150, resizeMode: "contain" },
  text: { fontSize: 32, fontWeight: "bold", color: "#5207B3", marginLeft: 10, textShadowColor: "rgba(0, 0, 0, 0.3)", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
});