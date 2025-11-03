import { API_ENDPOINTS, client } from "@/src/lib/axios";
import { selectToken } from "@/src/store/selectors/authSelectors";
import { store } from "@/src/store/store";
import axios from "axios";
import { DriverStatus, RideRequest, RideRequestResponse, ScheduledRidesResponse } from "../types";

const API_BASE = "https://api-nestjs-enatega.up.railway.app/api/v1";

let _isAcceptingRide = false;

// Mock data for development - replace with actual API calls
export const rideRequestsService = {
  // Get active ride requests
  getActiveRequests: async (
    latitude: number,
    longitude: number,
    radius: number = 5000,
    token?: string // optional auth token
  ): Promise<RideRequest[]> => {
    const state = store.getState();
    const newToken = selectToken(state);

    try {
      // Todo: need to get latitude and longitude from driver location slice
      // const { latitude, longitude } = state.driverLocation;
      const latitude = 33.7039556;
      const longitude = 72.9799404;

      const response = await axios.get(
        `${API_BASE}/ride-vehicles/nearby/${latitude}/${longitude}/${radius}?radius=${radius}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        }
      );
      const data = response.data;

      const requests: RideRequest[] = data.map((item: any) => ({
        id: item.id,
        profileImg: item?.passenger?.profile,
        passenger: {
          id: item.passenger_id,
          name: item.passenger.name,
          phoneNumber: "",
          rating: item.reviews?.averageRating ?? 0,
          totalRides: item.reviews?.count ?? 0,
        },
        passengerId: item?.passenger_id,
        pickupLocation: {
          latitude: item.locations?.pickup.lat,
          longitude: item.locations?.pickup.lng,
          address: item.locations?.pickup_location || "Pickup Location",
        },
        dropoffLocation: {
          latitude: item.locations?.dropoff.lat,
          longitude: item.locations?.dropoff.lng,
          address: item.locations?.dropoff_location || "Dropoff Location",
        },
        requestTime: item.createdAt,
        estimatedFare: parseFloat(item.offered_fair) || 0,
        distance: item.distance ?? 0,
        estimatedDuration: 0,
        status: item.status.toLowerCase(),
        rideType: item.is_hourly
          ? "hourly"
          : item.is_scheduled
          ? "scheduled"
          : "standard",
        paymentMethod: item.payment_via.toLowerCase(),
        specialInstructions: null,
        rideTypeId: item?.ride_type_id,
      }));

      return requests;
    } catch (error: any) {
      console.error("Error fetching ride requests:", error.response.data);
      throw error;
    }
  },

  // Accept a ride request
  acceptRideRequest: async (): Promise<RideRequestResponse> => {
    const state = store.getState();
    const token = selectToken(state);
    console.log("token", token);

    try {
      _isAcceptingRide = true;

      const response = await axios.get(
        `${API_BASE}/rides/ongoing/active/driver`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("Ride accepted successfully:", data);

      return data;
    } catch (error: any) {
      console.error(
        "Error accepting ride request:",
        error.response?.data || error
      );
      throw {
        success: false,
        message:
          error.response?.data?.message || "Failed to accept ride request",
      };
    } finally {
      _isAcceptingRide = false;
    }
  },

  // Optional: expose loading state for UI
  isAcceptingRide: () => _isAcceptingRide,

  // Decline a ride request
  declineRideRequest: async (
    requestId: string
  ): Promise<RideRequestResponse> => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await axiosInstance.post(`/api/ride-requests/${requestId}/decline`);
      // return response.data;

      // Mock response
      return {
        success: true,
        message: "Ride request declined",
      };
    } catch (error) {
      console.error("Error declining ride request:", error);
      throw error;
    }
  },
  getMyRiderId: async () => {
    const state = store.getState();
    const token = selectToken(state);

    try {
      const response = await axios.get(
        `${API_BASE}/ride-vehicles/rider/get-my-rider-id`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ My Rider Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching rider ID:", error);
      throw error;
    }
  },

  // Update driver status
  updateDriverStatus: async (
    status: DriverStatus
  ): Promise<{ success: boolean }> => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await axiosInstance.put('/api/driver/status', { status });
      // return response.data;

      // Mock response
      return { success: true };
    } catch (error) {
      console.error("Error updating driver status:", error);
      throw error;
    }
  },

  // get scheduled ride requests
  getScheduledRideRequests: async (): Promise<ScheduledRidesResponse[]> => {
    try {
      const response = await client.get(
        API_ENDPOINTS.RIDE_REQUESTS.SCHEDULED_RIDES
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching scheduled ride requests:", error);
      throw error;
    }
  },
};

export default rideRequestsService;
