import { Stack } from 'expo-router';

export default function RideRequestsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName='rideRequest'
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="rideRequest"/>
      <Stack.Screen name="tripDetail"/>
    </Stack>
  );
}