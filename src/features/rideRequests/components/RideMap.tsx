import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { fetchGoogleRoute } from "../services/MapServices/getRouteCoordinates";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RideMapProps {
  origin: Coordinate;
  destination: Coordinate;
  rideRequest?: any;
  shouldFetchRoute?: boolean; // 👈 Optional prop to control fetching
}

const RideMap: React.FC<RideMapProps> = ({ origin, destination, rideRequest, shouldFetchRoute = true }) => {
  const mapRef = useRef<MapView>(null);
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false); // 👈 Prevent multiple calls

  const fetchRouteOnce = async () => {
    if (hasFetched || !shouldFetchRoute) return; // ✅ Skip repeated calls
    if (origin && destination) {
      try {
        setLoading(true);
        const route = await fetchGoogleRoute(
          { lat: origin.latitude, lng: origin.longitude },
          { lat: destination.latitude, lng: destination.longitude },
          []
        );
        setRouteCoords(route);
        setHasFetched(true); // ✅ Mark as fetched
      } catch (err) {
        console.warn("⚠️ Failed to fetch route:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // 👇 Fetch only once manually when conditions are stable
  useEffect(() => {
    fetchRouteOnce();
  }, [origin?.latitude, destination?.latitude]);

  // 👇 Fit map view once both coordinates exist
  useEffect(() => {
    if (mapRef.current && origin && destination) {
      mapRef.current.fitToCoordinates([origin, destination], {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  }, [origin, destination]);

  const defaultRegion = {
    latitude: origin?.latitude || 33.6844,
    longitude: origin?.longitude || 73.0479,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={defaultRegion}>
        {/* Markers */}
        {origin && (
          <Marker coordinate={origin}>
            <View style={styles.iconContainer}>
              <Image source={require("../../../../assets/images/pickup.png")} style={styles.pickupIcon} />
            </View>
          </Marker>
        )}

        {destination && (
          <Marker coordinate={destination}>
            <View style={[styles.iconContainer, { backgroundColor: "red" }]}>
              <Image source={require("../../../../assets/images/dropoff.png")} style={styles.pickupIcon} />
            </View>
          </Marker>
        )}

        {/* Route */}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeColor="#007AFF" strokeWidth={4} />
        )}
      </MapView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
};

export default RideMap;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  iconContainer: {
    backgroundColor: "#6EE7B7",
    padding: 6,
    borderRadius: 20,
  },
  pickupIcon: { width: 8, height: 8, tintColor: "#fff" },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
});
