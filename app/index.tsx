import { selectIsLoggedIn } from '@/src/store/selectors/authSelectors';
import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';

export default function RootPage() {

  const isLoggedIn = useSelector(selectIsLoggedIn);

  console.log("app index page - isLoggedIn:", isLoggedIn);

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/(rideRequests)/rideRequest" />;
  }
  return <Redirect href="/(auth)/welcome" />;
}