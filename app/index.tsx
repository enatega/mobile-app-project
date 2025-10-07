import { Redirect } from 'expo-router';

export default function RootPage() {
  console.log("app index page")
  // redirect to discovery
  // return <Redirect href="/(tabs)/(discovery)/discovery" />;

  // redirect to zone-selection
  return <Redirect href="/(tabs)/(rideRequests)/rideRequest" />;
}

