import { selectToken } from '@/src/store/selectors/authSelectors';
import { store } from '@/src/store/store';
import axios from 'axios';
import { DriverStatus, RideRequest, RideRequestResponse } from '../types';


const API_BASE = "https://api-nestjs-enatega.up.railway.app/api/v1";

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
      const latitude = 24.8607;
      const longitude = 67.0011;
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
      }));

      return requests;
    } catch (error) {
      console.error("Error fetching ride requests:", error);
      throw error;
    }
  },

  // Accept a ride request
  acceptRideRequest: async (requestId: string): Promise<RideRequestResponse> => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await axiosInstance.post(`/api/ride-requests/${requestId}/accept`);
      // return response.data;

      // Mock response
      return {
        success: true,
        message: 'Ride request accepted successfully',
      };
    } catch (error) {
      console.error('Error accepting ride request:', error);
      throw error;
    }
  },

  // Decline a ride request
  declineRideRequest: async (requestId: string): Promise<RideRequestResponse> => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await axiosInstance.post(`/api/ride-requests/${requestId}/decline`);
      // return response.data;

      // Mock response
      return {
        success: true,
        message: 'Ride request declined',
      };
    } catch (error) {
      console.error('Error declining ride request:', error);
      throw error;
    }
  },

  // Update driver status
  updateDriverStatus: async (status: DriverStatus): Promise<{ success: boolean }> => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await axiosInstance.put('/api/driver/status', { status });
      // return response.data;

      // Mock response
      return { success: true };
    } catch (error) {
      console.error('Error updating driver status:', error);
      throw error;
    }
  },
};



export default rideRequestsService;
