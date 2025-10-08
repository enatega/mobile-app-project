import { GradientBackground, RideRequestsHeader } from '@/src/components/common';
import { useTheme } from '@/src/context/ThemeContext';
import { useDriverStatus } from '@/src/hooks/useDriverStatus';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { OfflineScreen, RideCard } from '../components';
import { useActiveRideRequests } from '../hooks/queries';


export const RideRequestsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { driverStatus } = useDriverStatus();
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 27, seconds: 48 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch ride requests from API
  const { data: rideRequests = [], isLoading, isRefetching, refetch } = useActiveRideRequests();

  // Countdown timer for upcoming ride
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing ride requests:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const activeRequests = driverStatus === 'online' ? rideRequests : [];

  return (
    <GradientBackground style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Custom Header */}
        <RideRequestsHeader />

       {/* Upcoming Ride Card */}
       {driverStatus === 'online' && (
         <View style={[styles.upcomingRideCard, { backgroundColor: colors.primary }]}>
           <View style={styles.upcomingRideHeader}>
             <Text style={styles.upcomingRideTitle}>Upcoming ride</Text>
             <View style={styles.timerContainer}>
               <Text style={styles.timerText}>
                 {String(countdown.hours).padStart(2, '0')} : {String(countdown.minutes).padStart(2, '0')} : {String(countdown.seconds).padStart(2, '0')}
               </Text>
             </View>
           </View>

           <View style={styles.upcomingRideContent}>
             <View style={styles.carIconContainer}>
               <Ionicons name="car-outline" size={32} color="#FFF" />
             </View>
             <View style={styles.upcomingRideInfo}>
               <Text style={styles.upcomingRideLabel}>Ride</Text>
               <View style={styles.upcomingRideLocation}>
                 <Ionicons name="location" size={14} color="#FFF" />
                 <Text style={styles.upcomingRideAddress} numberOfLines={1}>
                   79 Kampuchea Krom Boulevard...
                 </Text>
               </View>
             </View>
             <Text style={styles.upcomingRideFare}>QAR 48.75</Text>
           </View>
         </View>
       )}

      {/* Ride Requests List */}
      <FlatList
        data={activeRequests}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing || isRefetching} 
            onRefresh={handleRefresh} 
          />
        }
        renderItem={({ item }) => (
          <RideCard 
            rideRequest={item} 
            onMenuPress={(rideRequest) => {
              // Handle menu press - you can add actions here
              console.log('Menu pressed for ride:', rideRequest.id);
            }}
          />
        )}
        ListEmptyComponent={<OfflineScreen isOnline={driverStatus === 'online'} />}
      />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upcomingRideCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  upcomingRideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  upcomingRideTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  upcomingRideContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  upcomingRideInfo: {
    flex: 1,
  },
  upcomingRideLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  upcomingRideLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingRideAddress: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  upcomingRideFare: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default RideRequestsScreen;

