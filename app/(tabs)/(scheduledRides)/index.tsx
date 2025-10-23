// app/(tabs)/(rideRequests)/index.tsx
// UPDATED WITH FLOATING DEV MENU FOR TESTING AUTH FLOWS

import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { selectIsLoggedIn, selectUser } from '@/src/store/selectors/authSelectors';
import { logout } from '@/src/store/slices/auth.slice';
import { resetSignup } from '@/src/store/slices/signup.slice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const DUMMY_RIDES = [
  { id: '1', pickup: 'Downtown Plaza', dropoff: 'Airport Terminal 2', time: '10:30 AM', fare: '$25.00', status: 'pending' },
  { id: '2', pickup: 'City Mall', dropoff: 'Central Station', time: '11:15 AM', fare: '$18.50', status: 'pending' },
  { id: '3', pickup: 'Hotel Grand', dropoff: 'Beach Resort', time: '02:00 PM', fare: '$45.00', status: 'pending' },
  { id: '4', pickup: 'Office Tower', dropoff: 'Residential Area', time: '05:30 PM', fare: '$22.00', status: 'pending' },
];

export default function RideRequestsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  console.log("My user is :", user)
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  
  const [showDevMenu, setShowDevMenu] = useState(false);

  // ============================================
  // DEV MENU ACTIONS
  // ============================================
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            console.log('🔓 Logging out from dev menu...');
            dispatch(logout());
            dispatch(resetSignup());
            setShowDevMenu(false);
            router.replace('/(auth)/welcome');
          }
        }
      ]
    );
  };

  const handleTestSignup = () => {
    dispatch(logout());
    dispatch(resetSignup());
    setShowDevMenu(false);
    console.log('🧪 Testing signup flow...');
    router.replace('/(auth)/signup');
  };

  const handleTestLogin = () => {
    dispatch(logout());
    dispatch(resetSignup());
    setShowDevMenu(false);
    console.log('🧪 Testing login flow...');
    router.replace('/(auth)/login');
  };

  const handleGoToWelcome = () => {
    setShowDevMenu(false);
    console.log('🏠 Going to welcome screen...');
    router.push('/(auth)/welcome');
  };

  // ============================================
  // RENDER RIDE ITEM
  // ============================================
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Ride Requests</Text>
        <Text style={styles.subtitle}>{DUMMY_RIDES.length} active requests</Text>
      </View>
      
      {/* Ride List */}
      <FlatList
        data={DUMMY_RIDES}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* ============================================ */}
      {/* FLOATING DEV MENU BUTTON - ONLY IN DEV MODE */}
      {/* ============================================ */}
      {__DEV__ && (
        <TouchableOpacity
          onPress={() => setShowDevMenu(true)}
          style={styles.devMenuButton}
          activeOpacity={0.8}
        >
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* ============================================ */}
      {/* DEV MENU MODAL */}
      {/* ============================================ */}
      <Modal
        visible={showDevMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDevMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowDevMenu(false)}
          activeOpacity={1}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🛠️ Dev Menu</Text>
              <TouchableOpacity onPress={() => setShowDevMenu(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Current User Info */}
            {user && isLoggedIn && (
              <View style={styles.userInfoBox}>
                <Text style={styles.userInfoLabel}>Currently logged in as:</Text>
                <Text style={styles.userInfoName}>{user.name}</Text>
                <Text style={styles.userInfoPhone}>{user.phone}</Text>
              </View>
            )}

            {/* Menu Options */}
            <View style={styles.menuOptions}>
              {/* Test Signup */}
              <TouchableOpacity
                onPress={handleTestSignup}
                style={[styles.menuButton, { backgroundColor: '#4ECDC4' }]}
              >
                <Ionicons name="person-add" size={20} color="white" style={styles.menuIcon} />
                <Text style={styles.menuButtonText}>Test Signup Flow</Text>
              </TouchableOpacity>

              {/* Test Login */}
              <TouchableOpacity
                onPress={handleTestLogin}
                style={[styles.menuButton, { backgroundColor: '#45B7D1' }]}
              >
                <Ionicons name="log-in" size={20} color="white" style={styles.menuIcon} />
                <Text style={styles.menuButtonText}>Test Login Flow</Text>
              </TouchableOpacity>

              {/* Go to Welcome */}
              <TouchableOpacity
                onPress={handleGoToWelcome}
                style={[styles.menuButton, { backgroundColor: '#A8E6CF' }]}
              >
                <Ionicons name="home" size={20} color="white" style={styles.menuIcon} />
                <Text style={styles.menuButtonText}>Go to Welcome</Text>
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity
                onPress={handleLogout}
                style={[styles.menuButton, { backgroundColor: '#FF6B6B' }]}
              >
                <Ionicons name="log-out" size={20} color="white" style={styles.menuIcon} />
                <Text style={styles.menuButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>

            {/* Footer Note */}
            <View style={styles.devNote}>
              <Text style={styles.devNoteText}>
                💡 This menu only appears in development mode
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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

  // ============================================
  // DEV MENU STYLES
  // ============================================
  devMenuButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#FF6B6B',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userInfoBox: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  userInfoLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  userInfoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userInfoPhone: {
    fontSize: 14,
    color: '#666',
  },
  menuOptions: {
    gap: 12,
  },
  menuButton: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  devNote: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  devNoteText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});