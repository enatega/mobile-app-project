import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { fetchGoogleRoute } from "../services/MapServices/getRouteCoordinates";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RideMapProps {
  origin: Coordinate;
  destination: Coordinate;
  rideRequest?: any; // optional, in case you want to pass it
}

const GOOGLE_MAPS_API_KEY = "AIzaSyCcm7_Wd7uvmC9YnYLu2JHGWPt6z1MaL1E";


const RideMap: React.FC<RideMapProps> = ({ origin, destination, rideRequest }) => {
  const mapRef = useRef<MapView>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Automatically fit map to show both markers
  useEffect(() => {
    const fetchRoute = async () => {
      if (origin && destination) {
        setLoading(true);
        const route = await fetchGoogleRoute(
          { lat: origin.latitude, lng: origin.longitude },
          { lat: destination.latitude, lng: destination.longitude },
          [],
          GOOGLE_MAPS_API_KEY
        );
        setRouteCoords(route);
        setLoading(false);
      }
    };
    fetchRoute();
  }, [origin, destination]);

  useEffect(() => {
    if (mapRef.current && origin && destination) {
      mapRef.current.fitToCoordinates([origin, destination], {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  }, [origin, destination]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{

          latitude: rideRequest?.pickupLocation?.latitude ?? origin.latitude,
          longitude: rideRequest?.pickupLocation?.longitude ?? origin.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Origin Marker */}
        <Marker coordinate={origin}>
          <View style={styles.iconContainer}>
            <Ionicons name="car" size={20} color="#FFF" />
          </View>
        </Marker>

        {/* Destination Marker */}
        <Marker coordinate={destination}>
          <View style={[styles.iconContainer, { backgroundColor: "red" }]} />
        </Marker>

        {/* Route Line */}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeColor="#007AFF" strokeWidth={4} />
        )}
      </MapView>
    </View>
  );
};

export default RideMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  iconContainer: {
    backgroundColor: "black",
    padding: 6,
    borderRadius: 20,
  },
});
