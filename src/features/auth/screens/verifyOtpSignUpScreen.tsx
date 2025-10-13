// src/screens/auth/VerifyOtpSignupScreen.tsx
import BackButton from "@/src/components/common/BackButton";
import GradientBackground from "@/src/components/common/GradientBackground";
import Title from "@/src/features/auth/components/common/TitleHeader";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import OTPInput, { OTPInputHandle } from "../components/verifyScreens/OTPInput";

const VerifyOtpSignupScreen: React.FC = () => {
  const router = useRouter();
  const otpInputRef = useRef<OTPInputHandle>(null);
  
  const [otp, setOtp] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const CORRECT_OTP = "1234";

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Clear error when user types
  useEffect(() => {
    if (otp.length > 0 && hasError) {
      setHasError(false);
      setErrorMessage("");
    }
  }, [otp]);

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 4) {
      handleVerifyOTP();
    }
  }, [otp]);

  const handleVerifyOTP = () => {
    setIsVerifying(true);

    // Simulate API call
    setTimeout(() => {
      if (otp === CORRECT_OTP) {
        // Success - navigate to next screen
        setIsVerifying(false);
        router.push("/(auth)/signupSecondStage");
      } else {
        // Error - wrong OTP
        setIsVerifying(false);
        setHasError(true);
        setErrorMessage("The code you entered is incorrect");
        otpInputRef.current?.clear();
        setOtp("");
      }
    }, 800);
  };

  const handleResendOTP = () => {
    if (!canResend) return;

    // Simulate resend OTP
    setCountdown(30);
    setCanResend(false);
    setHasError(false);
    setErrorMessage("");
    otpInputRef.current?.clear();
    setOtp("");
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top-left back button */}
            <View style={styles.backButtonWrapper}>
              <BackButton
                size={48}
                iconSize={20}
                borderColor="#D1D5DB"
                iconColor="#000000"
                backgroundColor="rgba(255,255,255,0.1)"
              />
            </View>

            {/* Title Section */}
            <View style={styles.titleWrapper}>
              <Title
                heading="OTP"
                subheading="We have sent OTP code verification to your mobile no"
                containerStyle={styles.titleContainer}
              />
            </View>

            {/* Image Section - Below Title */}
            <View style={styles.imageContainer}>
              <Image
                source={require("@/src/assets/images/chatImage.png")}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* OTP Section */}
            <View style={styles.otpSection}>
              {/* Error message */}
              {hasError && (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning" size={16} color="#FF6B6B" />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* OTP Input */}
              <OTPInput
                ref={otpInputRef}
                onChangeText={setOtp}
                hasError={hasError}
                numberOfDigits={4}
                disabled={isVerifying}
              />

              {/* Verifying Indicator */}
              {isVerifying && (
                <View style={styles.verifyingContainer}>
                  <ActivityIndicator size="small" color="#3853A4" />
                  <Text style={styles.verifyingText}>Verifying...</Text>
                </View>
              )}
            </View>

            {/* Resend Section */}
            <View style={styles.resendSection}>
              <Text style={styles.resendLabel}>
                Didn't receive the code?
              </Text>

              {canResend ? (
                <TouchableOpacity
                  onPress={handleResendOTP}
                  style={styles.resendButton}
                >
                  <Text style={styles.resendButtonText}>Resend Code</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.countdownText}>
                  Resend in {formatCountdown(countdown)}
                </Text>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default VerifyOtpSignupScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButtonWrapper: {
    paddingTop: 10,
    paddingLeft: 20,
    marginBottom: 20,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  titleContainer: {},
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 20,
  },
  image: {
    width: 320,
    height: 256,
  },
  otpSection: {
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 10,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginLeft: 6,
  },
  verifyingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  verifyingText: {
    color: "#3853A4",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "500",
  },
  resendSection: {
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  resendLabel: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 12,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    color: "#3853A4",
    fontSize: 16,
    fontWeight: "600",
  },
  countdownText: {
    color: "#9CA3AF",
    fontSize: 16,
  },
});