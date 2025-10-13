// src/screens/auth/LoginScreen.tsx
import BackButton from "@/src/components/common/BackButton";
import GradientBackground from "@/src/components/common/GradientBackground";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Title from "../components/common/TitleHeader";

const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <GradientBackground>
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
        {/* Top-left back button */}
        <View style={[styles.backButtonWrapper, { top: insets.top + 10 }]}>
          <BackButton
            size={48}
            iconSize={20}
            borderColor="#D1D5DB"
            iconColor="#000000"
            backgroundColor="rgba(255,255,255,0.1)"
          />
        </View>

        {/* Title Section - Below Back Button */}
        <View style={styles.titleWrapper}>
          <Title 
            heading="Log in" 
            subheading="Hello, Welcome back to your account." 
            containerStyle={styles.titleContainer}
          />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Add your login UI here later */}
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: "relative",
  },
  backButtonWrapper: {
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
  titleWrapper: {
    marginTop: 80, // Space for back button (48px button + margins)
    paddingHorizontal: 20,
  },
  titleContainer: {
    // Additional custom styling for Title component if needed
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});