import BackButton from "@/src/components/common/BackButton";
import GradientBackground from "@/src/components/common/GradientBackground";
import { useAppDispatch } from "@/src/store/hooks";
import { setPersonalInfo } from "@/src/store/slices/signup.slice";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Title from "../components/common/TitleHeader";
import Stepper from "../components/common/stepper";
import PersonalInfoForm from "../components/forms/personalInfoForm";
import { PersonalInfoFormValues } from "../types";

const SignupScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const handlePersonalInfoSubmit = (values: PersonalInfoFormValues) => {
    console.log("Personal Info Values:", values);
    
    // Save to Redux store
    dispatch(setPersonalInfo(values));
    
    // Navigate to verification method screen
    router.push("/(auth)/verificationmethod");
    
    // You can also call API here to send data to backend if needed
  };

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

        {/* Title Section */}
        <View style={styles.titleWrapper}>
          <Title
            heading="Sign up"
            subheading="Hello, Welcome to your account."
            containerStyle={styles.titleContainer}
          />
        </View>

        {/* Fixed Stepper - Always showing step 1 */}
        <View style={styles.stepperWrapper}>
          <Stepper
            steps={[
              { number: "01", title: "Personal Info" },
              { number: "02", title: "Document Submission" },
              { number: "03", title: "Vehicle Requirements" },
            ]}
            currentStep={1}
          />
        </View>

        {/* Personal Info Form - Always rendered on this screen */}
        <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default SignupScreen;

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
    marginTop: 80,
    paddingHorizontal: 20,
  },
  titleContainer: {},
  stepperWrapper: {
    paddingHorizontal: 3,
    paddingVertical: 8,
  },
});