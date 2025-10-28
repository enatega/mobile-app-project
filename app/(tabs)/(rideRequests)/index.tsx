import { RideRequestsScreen } from '@/src/features/rideRequests/screens';
import { webSocketService } from '@/src/services/socket/webSocketService';
import { selectUser } from '@/src/store/selectors/authSelectors';
import { setNewRideRequest } from '@/src/store/slices/requestedRide';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function RideRequestsRoute() {
  console.log('🚗 RideRequestsRoute is rendering!');
  const dispatch = useDispatch();



  const user = useSelector(selectUser);

  useEffect(() => {
    if (user?.id) {
      console.log('🔑 Connecting WebSocket for user:', user.id);

      webSocketService
        .connect(user.id)
        .then(() => console.log('✅ WebSocket connected successfully'))
        .catch((error) => console.error('❌ WebSocket connection failed:', error));

      const unsubscribeMessage = webSocketService.onMessage((message) => {
        console.log('📩 Message received in App:', message);
      });

      const unsubscribeConnection = webSocketService.onConnectionChange((connected) => {
        console.log('🌐 WebSocket connection status changed:', connected);
      });

      const unsubscribeNewRide = webSocketService.onNewRideRequest((data) => {
        console.log('🔥 Received new ride for driver:', data);
        dispatch(setNewRideRequest(data));
      });

      return () => {
        console.log('👋 Cleaning up WebSocket connection');
        unsubscribeMessage();
        unsubscribeConnection();
        unsubscribeNewRide();
        webSocketService.disconnect();
      };
    }
  }, [user?.id]);

  return <RideRequestsScreen />;
}