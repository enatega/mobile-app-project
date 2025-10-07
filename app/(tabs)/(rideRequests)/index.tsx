import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DUMMY_RIDES = [
  { id: '1', pickup: 'Downtown Plaza', dropoff: 'Airport Terminal 2', time: '10:30 AM', fare: '$25.00', status: 'pending' },
  { id: '2', pickup: 'City Mall', dropoff: 'Central Station', time: '11:15 AM', fare: '$18.50', status: 'pending' },
  { id: '3', pickup: 'Hotel Grand', dropoff: 'Beach Resort', time: '02:00 PM', fare: '$45.00', status: 'pending' },
  { id: '4', pickup: 'Office Tower', dropoff: 'Residential Area', time: '05:30 PM', fare: '$22.00', status: 'pending' },
];

export default function RideRequestsScreen() {
  const renderRideItem = ({ item }: any) => (
    <TouchableOpacity style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <Ionicons name="location" size={20} color="#1691BF" />
        <Text style={styles.rideTime}>{item.time}</Text>
      </View>
      
      <View style={styles.rideDetails}>
        <View style={styles.locationRow}>
          <Ionicons name="radio-button-on" size={16} color="#10B981" />
          <Text style={styles.locationText}>{item.pickup}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color="#EF4444" />
          <Text style={styles.locationText}>{item.dropoff}</Text>
        </View>
      </View>
      
      <View style={styles.rideFooter}>
        <Text style={styles.fareText}>{item.fare}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.declineButton}>
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ride Requests</Text>
        <Text style={styles.subtitle}>{DUMMY_RIDES.length} active requests</Text>
      </View>
      
      <FlatList
        data={DUMMY_RIDES}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1F2937',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  listContainer: {
    padding: 16,
  },
  rideCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  rideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rideTime: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  rideDetails: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  locationText: {
    fontSize: 16,
    color: '#E5E7EB',
    marginLeft: 12,
    flex: 1,
  },
  divider: {
    height: 20,
    width: 2,
    backgroundColor: '#374151',
    marginLeft: 7,
    marginVertical: 4,
  },
  rideFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fareText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1691BF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  declineButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  declineText: {
    color: '#E5E7EB',
    fontWeight: '600',
  },
  acceptButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1691BF',
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});