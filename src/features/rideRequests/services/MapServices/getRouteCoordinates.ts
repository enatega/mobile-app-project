

const Api_Url = process.env.EXPO_BASE_URL

export const fetchGoogleRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  stops: { lat: number; lng: number }[] = []
) => {
  try {
    const url = `https://api-nestjs-enatega.up.railway.app/api/v1/maps/route?originLat=${origin.lat}&originLng=${origin.lng}&destinationLat=${destination.lat}&destinationLng=${destination.lng}`;

    const res = await fetch(url);
    const data = await res.json();


    if (!data?.path || !Array.isArray(data.path)) {
      console.warn("⚠️ No valid path found in response");
      return [];
    }

    // Convert [lat, lng] pairs into { latitude, longitude } objects
    const routeCoords = data.path.map(([lat, lng]: [number, number]) => ({
      latitude: lat,
      longitude: lng,
    }));

    return routeCoords;
  } catch (error) {
    console.error("❌ Error fetching route:", error);
    return [];
  }
};
