import { CustomHeader } from "@/src/components/common";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import CustomText from "@/src/components/ui/Text";
import { globalStyles } from "@/src/constants";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { InfoCard, MiniPofileCard } from "../components";
import { useFetchRiderProfile } from "../hooks/queries";

const profileScreen = () => {
  const { data, isLoading, error, refetch } = useFetchRiderProfile();

  const userObject = {
    name: data?.user?.name || "",
    email: data?.user?.email || "",
    profile: data?.user?.profile || "",
    rating: data?.reviewsData?.averageRating || "",
    totalReviews: data?.reviewsData?.totalReviews || "",
  };

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
        <CustomText>Something went wrong</CustomText>
        <Button
          title="Retry"
          variant="primary"
          onPress={() => {
            refetch();
          }}
        />
      </View>
    );
  }

  return (
    <GradientBackground>
      <CustomHeader title="Your Profile" />
      <View style={globalStyles.containerPadding}>
        <MiniPofileCard userDetails={userObject} />
        <InfoCard
          title="Personal info"
          description="Update your personal and contact details."
          onPress={() => {
            router.navigate("/(tabs)/(profile)/personal-info");
          }}
        />
        <InfoCard
          title="Payment methods"
          description="Add or Update your saved payment methods."
        />
        <InfoCard
          title="Support and feedback"
          description="Reach out for help or give feedback on your experience."
        />
        <InfoCard
          title="Security and settings"
          description="Update your password and change app preferences."
        />
      </View>
    </GradientBackground>
  );
};

export default profileScreen;
