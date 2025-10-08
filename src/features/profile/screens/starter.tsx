import { CustomHeader } from "@/src/components/common";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const starter = () => {
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

  return (
    <GradientBackground>
      <CustomHeader title="Your Profile" />
    </GradientBackground>
  );
};

export default starter;

const styles = StyleSheet.create({});
