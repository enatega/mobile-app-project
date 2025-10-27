export const decodePolyline = (t: string) => {
  let points: { latitude: number; longitude: number }[] = [];
  let index = 0, lat = 0, lng = 0;

  while (index < t.length) {
    let b, shift = 0, result = 0;
    do {
      b = t.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = t.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return points;
};

export const fetchGoogleRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  stops: { lat: number; lng: number }[] = [],
  apiKey: string
) => {
  const originStr = `${origin.lat},${origin.lng}`;
  const destinationStr = `${destination.lat},${destination.lng}`;
  const waypoints = stops.length
    ? `&waypoints=${stops.map((s) => `${s.lat},${s.lng}`).join("|")}`
    : "";

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}${waypoints}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.routes?.length) {
      console.warn("⚠️ No routes found from Google");
      return [];
    }

    const encoded = data.routes[0].overview_polyline.points;
    return decodePolyline(encoded);
  } catch (error) {
    console.error("❌ Error fetching route:", error);
    return [];
  }
};
