import { Redirect } from 'expo-router';

export default function RootPage() {
  console.log("🚀 App starting - redirecting to Ride Requests");
  
  // Redirect to the main ride requests screen
  return <Redirect href="/(tabs)/(rideRequests)" />;
}

