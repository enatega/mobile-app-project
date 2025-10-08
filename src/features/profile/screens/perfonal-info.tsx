import { CustomHeader } from "@/src/components/common";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import CustomText from "@/src/components/ui/Text";
import { globalStyles } from "@/src/constants";
import { useTheme } from "@/src/context/ThemeContext";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const personalInfo = () => {
  let isLoading;
  let error;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#DAD5FB" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Text>Something went wrong</Text>
        <Button title="Retry" variant="primary" onPress={() => {}} />
      </View>
    );
  }

  const theme = useTheme();

  return (
    <GradientBackground>
      <CustomHeader title="Your Profile" />
      <View style={[globalStyles.containerPadding, styles.container]}>
        <CustomText variant="h1" style={{ color: theme.colors.colorText }}>
          Personal info
        </CustomText>
      </View>
    </GradientBackground>
  );
};

export default personalInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
});
