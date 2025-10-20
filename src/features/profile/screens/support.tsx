import { CustomHeader } from "@/src/components/common";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import CustomText from "@/src/components/ui/Text";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const support = () => {
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
      <CustomHeader title="Support" />
      <ScrollView>
        <View style={{ padding: 16 }}>
          <CustomText>support screen</CustomText>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

export default support;

const styles = StyleSheet.create({});
