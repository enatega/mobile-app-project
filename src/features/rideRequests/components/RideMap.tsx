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
}



const RideMap: React.FC<RideMapProps> = ({ origin, destination, rideRequest }) => {
  const mapRef = useRef<MapView>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      if (origin && destination) {
        setLoading(true);
        const route = await fetchGoogleRoute(
          { lat: origin.latitude, lng: origin.longitude },
          { lat: destination.latitude, lng: destination.longitude },
          [],
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

          latitude: rideRequest?.pickupLocation?.latitude ? origin.latitude : 33.6844,
          longitude: rideRequest?.pickupLocation?.longitude ? origin.longitude : 73.0479,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Origin Marker */}
        <Marker coordinate={origin}>
          <View style={styles.iconContainer}>
            <Image source={require('../../../../assets/images/pickup.png')} style={styles.pickupIcon} />
          </View>
        </Marker>

        {/* Destination Marker */}
        <Marker coordinate={destination}>
          <View style={[styles.iconContainer, { backgroundColor: "red" }]}>
            <Image source={require('../../../../assets/images/dropoff.png')} style={styles.pickupIcon} />
          </View>
        </Marker>

        {/* Route Line */}
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
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  iconContainer: {
    backgroundColor: "#6EE7B7",
    padding: 6,
    borderRadius: 20,
  },
  pickupIcon: {
    width: 8,
    height: 8,
    tintColor: "#fff",
  },
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
