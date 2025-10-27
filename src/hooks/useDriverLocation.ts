import * as Location from 'expo-location';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setDriverLocation } from '../store/slices/driverLocation.slice';
import { setDriverStatus } from '../store/slices/driverStatus.slice';

interface LocationHookResult {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  requestPermissionAndFetchLocation: () => Promise<void>;
}

export const useDriverLocation = (): LocationHookResult => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dispatch = useAppDispatch()

const requestPermissionAndFetchLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied.');
        // Alert.alert('Permission denied', 'Location permission is needed to use this feature.');
        dispatch(setDriverStatus('offline'))
        return;
      }
      setErrorMsg(null);

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Store in Redux
      dispatch(setDriverLocation({
        latitude: currentLocation.coords.latitude.toString(),
        longitude: currentLocation.coords.longitude.toString()
      }));
    } catch (error) {
      setErrorMsg('Failed to fetch location.');
      console.error(error);
    }
  }, [dispatch]);

  return { location, errorMsg, requestPermissionAndFetchLocation };
};
