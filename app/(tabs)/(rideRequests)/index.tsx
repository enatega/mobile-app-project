import { RideRequestsScreen } from '@/src/features/rideRequests/screens';
import { webSocketService } from '@/src/services/socket/webSocketService';
import { selectUser } from '@/src/store/selectors/authSelectors';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function RideRequestsRoute() {
  console.log('🚗 RideRequestsRoute is rendering!');

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

      return () => {
        console.log('👋 Cleaning up WebSocket connection');
        unsubscribeMessage();
        unsubscribeConnection();
        webSocketService.disconnect();
      };
    }
  }, [user?.id]);

  return <RideRequestsScreen />;
}