import GradientBackground from "@/src/components/common/GradientBackground";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import CustomHeader from "../../../../components/common/CustomHeader";
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
        <Text>Something went wrong</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#DAD5FB",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
          }}
          onPress={() => {
            refetch();
          }}
        >
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GradientBackground>
      <CustomHeader title="Your Profile" />
      <MiniPofileCard userDetails={userObject} />
      <InfoCard
        title="Personal info"
        description="Update your personal and contact details."
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
    </GradientBackground>
  );
};

export default profileScreen;
