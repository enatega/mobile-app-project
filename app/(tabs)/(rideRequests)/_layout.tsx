import { Stack } from 'expo-router';

export default function RideRequestsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="rideRequest"/>
    </Stack>
  );
}