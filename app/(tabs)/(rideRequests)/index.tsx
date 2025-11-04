import {
  RideRequestsScreen,
  TripDetailsScreen,
} from "@/src/features/rideRequests/screens";
import rideRequestsService from "@/src/features/rideRequests/services";
import { webSocketService } from "@/src/services/socket/webSocketService";
import { selectUser } from "@/src/store/selectors/authSelectors";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function RideRequestsRoute() {
  console.log("🚗 RideRequestsRoute is rendering!");
  const dispatch = useDispatch();
  const [activeRide, setActiveRide] = useState(false);

  const user = useSelector(selectUser);

  useEffect(() => {
    console.log("current user:", user);
    if (user?.id) {
      console.log("🔑 Connecting WebSocket for user:", user.id);

      webSocketService
        .connect(user.id)
        .then(() => console.log("✅ WebSocket connected successfully"))
        .catch((error) =>
          console.error("❌ WebSocket connection failed:", error)
        );

      const unsubscribeMessage = webSocketService.onMessage((message) => {
        console.log("📩 Message received in App:", message);
      });

      const unsubscribeConnection = webSocketService.onConnectionChange(
        (connected) => {
          console.log("🌐 WebSocket connection status changed:", connected);
        }
      );

      // const unsubscribeNewRide = webSocketService.onNewRideRequest((data) => {
      //   console.log('🔥 Received new ride for driver:', data);
      //   dispatch(setNewRideRequest(data));
      // });

      return () => {
        console.log("👋 Cleaning up WebSocket connection");
        unsubscribeMessage();
        unsubscribeConnection();
        // unsubscribeNewRide();
        webSocketService.disconnect();
      };
    }
  }, [user?.id]);

  const fetchActiveRide = useCallback(async () => {
    try {
      const data = await rideRequestsService.acceptRideRequest();
      console.log("Active ride data:", data);
      if (data?.isActiveRide === "true") {
        router.push("/tripDetail");
      }

      setActiveRide(false);
    } catch (err) {
      console.error("❌ Error fetching active ride:", err);
      setActiveRide(false);
    } finally {
      console.log("finally data loaded");
    }
  }, [activeRide]);

  useEffect(() => {
    fetchActiveRide();
  }, [fetchActiveRide]);

  // useEffect(() => {
  //   // ✅ Listen for bid accepted event
  //   const unsubscribe = webSocketService.onBidAccepted((data) => {
  //     console.log('🎯 Bid accepted event received:', data);

  //     // Example data: { rideRequestId, ride_request_is_now_ride, message }

  //     if (data.message === 'Your bid was accepted. Ride started!') {
  //       console.log("Your bid was accepted. Ride started!")
  //       // ✅ Navigate and update UI
  //       router.push('/tripDetail');
  //       // Optional: set offering state if needed
  //       // setIsOffering(true);
  //     }
  //   });

  //   return () => {
  //     unsubscribe(); // Cleanup listener on unmount
  //   };
  // }, []);

  if (activeRide) {
    return <TripDetailsScreen />;
  }

  return <RideRequestsScreen />;
}
