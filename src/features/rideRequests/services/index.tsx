import { DriverStatus, RideRequest, RideRequestResponse } from '../types';

// Mock data for development - replace with actual API calls
export const rideRequestsService = {
  // Get active ride requests
  getActiveRequests: async (): Promise<RideRequest[]> => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await axiosInstance.get('/api/ride-requests/active');
      // return response.data;

      // Mock data for now
      return MOCK_RIDE_REQUESTS;
    } catch (error) {
      console.error('Error fetching ride requests:', error);
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

// Mock data for development
const MOCK_RIDE_REQUESTS: RideRequest[] = [
  {
    id: '1',
    passenger: {
      id: 'p1',
      name: 'Muhammad Ali',
      phoneNumber: '+1234567890',
      rating: 4.7,
      totalRides: 312,
    },
    pickupLocation: {
      latitude: 40.7128,
      longitude: -74.006,
      address: '79 Kampuchea Krom Boulevard (128)',
      landmark: 'Near Central Mall',
    },
    dropoffLocation: {
      latitude: 40.7614,
      longitude: -73.9776,
      address: 'JFK Airport Terminal 2, Queens, NY',
    },
    requestTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    estimatedFare: 56.53,
    distance: 1.7,
    estimatedDuration: 25,
    status: 'accepted',
    rideType: 'scheduled',
    paymentMethod: 'card',
    specialInstructions: undefined,
  },
  {
    id: '2',
    passenger: {
      id: 'p2',
      name: 'Sarah Johnson',
      phoneNumber: '+1234567891',
      rating: 4.7,
      totalRides: 128,
    },
    pickupLocation: {
      latitude: 40.7489,
      longitude: -73.9680,
      address: '79 Kampuchea Krom Boulevard (128)',
    },
    dropoffLocation: {
      latitude: 40.7527,
      longitude: -73.9772,
      address: 'Central Station, 789 Park Ave, NY',
    },
    requestTime: new Date(Date.now() - 300000).toISOString(),
    estimatedFare: 56.53,
    distance: 1.7,
    estimatedDuration: 15,
    status: 'pending',
    rideType: 'standard',
    paymentMethod: 'cash',
    specialInstructions: undefined,
  },
  {
    id: '3',
    passenger: {
      id: 'p3',
      name: 'Mike Wilson',
      phoneNumber: '+1234567892',
      rating: 4.7,
      totalRides: 528,
    },
    pickupLocation: {
      latitude: 40.7580,
      longitude: -73.9855,
      address: '79 Kampuchea Krom Boulevard (128)',
    },
    dropoffLocation: {
      latitude: 40.7282,
      longitude: -74.0776,
      address: 'Beach Resort, Staten Island, NY',
    },
    requestTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    estimatedFare: 56.53,
    distance: 1.7,
    estimatedDuration: 35,
    status: 'pending',
    rideType: 'hourly',
    paymentMethod: 'wallet',
    specialInstructions: 'Business charter • 3-hour block',
  },
];

export default rideRequestsService;
