import { Stack } from 'expo-router';

export default function RideRequestsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled:false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="rideRequest"/>
      <Stack.Screen name="tripDetail"  options={{
          // presentation: "modal", 
          headerShown: false,
        }}/>
    </Stack>
  );
}



