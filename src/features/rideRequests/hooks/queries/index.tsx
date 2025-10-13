import { useQuery } from '@tanstack/react-query';
import rideRequestsService from '../../services';

// Query keys
export const RIDE_REQUESTS_QUERY_KEYS = {
  all: ['rideRequests'] as const,
  active: ['rideRequests', 'active'] as const,
};

// Hook to fetch active ride requests
export const useActiveRideRequests = () => {
  return useQuery({
    queryKey: RIDE_REQUESTS_QUERY_KEYS.active,
    queryFn: rideRequestsService.getActiveRequests,
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
  });
};

export default useActiveRideRequests;

