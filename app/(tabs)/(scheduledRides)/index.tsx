import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DUMMY_SCHEDULED_RIDES = [
  { id: '1', pickup: 'Home', dropoff: 'Office', date: 'Oct 7', time: '08:00 AM', fare: '$15.00', recurring: true },
  { id: '2', pickup: 'Airport', dropoff: 'Hotel Downtown', date: 'Oct 8', time: '03:30 PM', fare: '$35.00', recurring: false },
  { id: '3', pickup: 'Restaurant', dropoff: 'Theater District', date: 'Oct 9', time: '07:00 PM', fare: '$12.00', recurring: false },
  { id: '4', pickup: 'Office', dropoff: 'Home', date: 'Oct 7', time: '06:00 PM', fare: '$15.00', recurring: true },
];

export default function ScheduledRidesScreen() {
  const renderScheduledRide = ({ item }: any) => (
    <TouchableOpacity style={styles.rideCard}>
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        {item.recurring && (
          <View style={styles.recurringBadge}>
            <Ionicons name="repeat" size={14} color="#1691BF" />
            <Text style={styles.recurringText}>Recurring</Text>
          </View>
        )}
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.locationRow}>
          <View style={styles.dotGreen} />
          <Text style={styles.locationText}>{item.pickup}</Text>
        </View>

        <View style={styles.routeLine} />

        <View style={styles.locationRow}>
          <View style={styles.dotRed} />
          <Text style={styles.locationText}>{item.dropoff}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.fareText}>{item.fare}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={16} color="#1691BF" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scheduled Rides</Text>
        <Text style={styles.subtitle}>{DUMMY_SCHEDULED_RIDES.length} upcoming rides</Text>
      </View>

      <FlatList
        data={DUMMY_SCHEDULED_RIDES}
        renderItem={renderScheduledRide}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
    paddingBottom: 80,
  },
  rideCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  timeText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  recurringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1691BF',
    gap: 4,
  },
  recurringText: {
    fontSize: 12,
    color: '#1691BF',
    fontWeight: '500',
  },
  routeContainer: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  dotRed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  locationText: {
    fontSize: 16,
    color: '#E5E7EB',
    marginLeft: 12,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#374151',
    marginLeft: 5,
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1691BF',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  editText: {
    color: '#1691BF',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1691BF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});