import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from "react-native-maps";


const RideMap = () => {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 25.276987,
                    longitude: 55.296249,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker coordinate={{ latitude: 25.276987, longitude: 55.296249 }} />
            </MapView>
        </View>
    )
}

export default RideMap

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
})