import { CustomHeader, GradientBackground } from "@/src/components/common";
import { globalStyles } from "@/src/constants";
import React, { useMemo, useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";

import { useDriverStatus } from "@/src/hooks/useDriverStatus";
import { SwipeListView } from "react-native-swipe-list-view";
import { OfflineScreen, RideCard } from "../components";
import { useScheduledRideRequests } from "../hooks/queries";

export const ScheduleRideRequestsScreen: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { driverStatus } = useDriverStatus();

  // Fetch ride requests from API
  const {
    data: rideRequests = [],
    isRefetching,
    refetch,
  } = useScheduledRideRequests();

  const requests = useMemo(() => {
    if (!rideRequests?.data) return [];
    return rideRequests?.data?.map((item: any) => ({
      id: item.rideId,
      profileImg: item?.passenger?.profile,
      passenger: {
        id: item.passenger?.id,
        name: item.passenger?.name,
        phoneNumber: item.passenger?.phone ?? "",
        rating: 0, // Not present in response
        totalRides: 0, // Not present in response
      },
      passengerId: item.passenger?.id,
      pickupLocation: {
        latitude: item.pickup?.coordinates?.lat,
        longitude: item.pickup?.coordinates?.lng,
        address: item.pickup?.location || "Pickup Location",
      },
      dropoffLocation: {
        latitude: item.dropoff?.coordinates?.lat,
        longitude: item.dropoff?.coordinates?.lng,
        address: item.dropoff?.location || "Dropoff Location",
      },
      requestTime: item.scheduledAt ?? item.createdAt,
      estimatedFare:
        typeof item.agreedPrice === "number" ? item.agreedPrice : 0,
      distance: 0, // Not present in response
      estimatedDuration: 0, // Not present in response
      status: item.status ? item.status.toLowerCase() : "",
      rideType: item.isHourly
        ? "hourly"
        : item.isFamily
        ? "family"
        : item.rideType?.name?.toLowerCase() || "standard",
      paymentMethod: item.paymentVia ? item.paymentVia.toLowerCase() : "",
      specialInstructions: null,
      rideTypeId: item.rideType?.id,
    }));
  }, [rideRequests]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing ride requests:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <GradientBackground style={{ flex: 1 }}>
      <CustomHeader title="Scheduled Rides" showBackButton={false} />
      <View style={[styles.container, globalStyles.containerPadding]}>
        <SwipeListView
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RideCard
              rideRequest={item}
              onMenuPress={(rideRequest) =>
                console.log("Menu pressed for ride:", rideRequest.id)
              }
              onPress={() => console.log("Ride pressed", item.id)}
            />
          )}
          leftOpenValue={0}
          stopLeftSwipe={0}
          disableLeftSwipe={false}
          disableRightSwipe
          closeOnRowPress
          recalculateHiddenLayout
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing || isRefetching}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={
            <OfflineScreen
              isOnline={driverStatus === "online"}
              title="No Scheduled Requests"
              description="Currently you do not have any scheduled ride."
            />
          }
        />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 64,
    paddingTop: 8,
  },
});

export default ScheduleRideRequestsScreen;
