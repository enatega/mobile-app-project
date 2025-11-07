import * as Location from "expo-location";
import { useCallback, useRef, useState } from "react";
import { Platform } from "react-native";
import { updateRiderCurrentLocation } from "../services/currentLocationApi";
import {
  IRiderLocation,
  webSocketService,
} from "../services/socket/webSocketService";
import { useAppDispatch } from "../store/hooks";
import { setDriverLocation } from "../store/slices/driverLocation.slice";
import { setDriverStatus } from "../store/slices/driverStatus.slice";

interface LocationHookResult {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  isTracking: boolean;
  requestPermissionAndFetchLocation: () => Promise<boolean>;
  startLocationTracking: () => void;
  stopLocationTracking: () => void;
}

export const useDriverLocation = (): LocationHookResult => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const dispatch = useAppDispatch();

  // Use ref to store subscription so it persists across renders
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  // Replace your requestPermissionAndFetchLocation function
  const requestPermissionAndFetchLocation = useCallback(async () => {
    try {
      // Step 1: Check if location services are enabled
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setErrorMsg(
          "Location services are disabled. Please enable GPS in Settings."
        );
        dispatch(setDriverStatus("offline"));
        return false;
      }

      // Step 2: Request foreground permission FIRST
      console.log("📍 Requesting foreground location permission...");
      const foregroundStatus =
        await Location.requestForegroundPermissionsAsync();

      console.log("Foreground permission status:", foregroundStatus);

      if (foregroundStatus.status !== "granted") {
        setErrorMsg(
          "Foreground Location permission was denied. Please enable it in Settings."
        );
        dispatch(setDriverStatus("offline"));
        console.log(
          `⚠️ Foreground location permission denied in ${Platform.OS}`
        );
        return false;
      }

      console.log("📍 Requesting foreground location permission...");
      const backgroundStatus =
        await Location.requestBackgroundPermissionsAsync();

      console.log("Background permission status:", backgroundStatus);

      if (backgroundStatus.status !== "granted") {
        setErrorMsg(
          "Background Location permission was denied. Please enable it in Settings."
        );
        dispatch(setDriverStatus("offline"));
        console.log(
          `⚠️ Background location permission denied in ${Platform.OS}`
        );
        return false;
      }
      // Step 4: Get initial location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        mayShowUserSettingsDialog: true, // helps on Android
      });

      console.log("✅ Initial location obtained:", {
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude,
      });

      setLocation(currentLocation);
      setErrorMsg(null);

      // Store in Redux
      dispatch(
        setDriverLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        })
      );

      try {
        // Update in backend
        await updateRiderCurrentLocation(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
      } catch (error) {
        console.log("⚠️ Backend update failed:", error);
      }

      return true;
    } catch (error) {
      console.error("❌ Failed to fetch location:", error);
      setErrorMsg("Failed to fetch location. Please check your permissions.");
      return false;
    }
  }, [dispatch]);


  // 🎯 Start only foreground tracking
  const startLocationTracking = useCallback(async () => {
    try {
      console.log("🔄 Starting FOREGROUND location tracking...");

      // Start foreground location watching
      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 10000,
        },
        (newLocation) => {
          console.log("📍 FOREGROUND Location update:", {
            lat: newLocation.coords.latitude,
            lng: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy,
          });

          setLocation(newLocation);

          // Update Redux
          dispatch(
            setDriverLocation({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            })
          );

          if (webSocketService.isSocketConnected()) {
            const riderLocationParams: IRiderLocation = {
              // Todo: replace with actual IDs
              riderId: "rider123",
              customerId: "customer456",
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            };
            console.log("Socket connected, now updating rider's location");
            webSocketService.updateRiderLocation(riderLocationParams);
          } else {
            console.log("Socket not connected, cannot update rider's location");
          }

        }
      );

      console.log("✅ Foreground location tracking started");
    } catch (error) {
      console.error("❌ Failed to start foreground tracking:", error);
      throw error;
    }
  }, [dispatch]);

  // 🎯 Stop foreground tracking
  const stopLocationTracking = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
      console.log("✅ Foreground location tracking stopped");
    }
  }, []);

  return {
    location,
    errorMsg,
    isTracking,
    requestPermissionAndFetchLocation,
    startLocationTracking,
    stopLocationTracking,
  };
};
