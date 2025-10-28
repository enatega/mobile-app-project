import { GradientBackground, RideRequestsHeader } from '@/src/components/common';
import { useTheme } from '@/src/context/ThemeContext';
import { useDriverLocation } from '@/src/hooks/useDriverLocation';
import { useDriverStatus } from '@/src/hooks/useDriverStatus';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { FareInputModal, OfflineScreen, RideCard, RideDetailsModal } from '../components';
import { useActiveRideRequests } from '../hooks/queries';
import { RideRequest } from '../types';

type RideRowMap = Record<string, SwipeRow<RideRequest>>;
const LIST_HORIZONTAL_PADDING = 16;
const ACTION_RAIL_MAX_WIDTH = 320;
const ACTION_GAP = 8;

export const RideRequestsScreen: React.FC = () => {
  const { requestPermissionAndFetchLocation } = useDriverLocation();
  const { colors } = useTheme();
  const { driverStatus } = useDriverStatus();
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 27, seconds: 48 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRide, setSelectedRide] = useState<RideRequest | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fareInputVisible, setFareInputVisible] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const cardRailWidth = useMemo(
    () => Math.max(0, windowWidth - LIST_HORIZONTAL_PADDING * 2),
    [windowWidth]
  );
  const actionWidth = useMemo(
    () => Math.min(ACTION_RAIL_MAX_WIDTH, Math.max(120, cardRailWidth * 0.2)),
    [cardRailWidth]
  );
  const rightOpenValue = -actionWidth;
  
  // Fetch ride requests from API
  const { data: rideRequests = [], isRefetching, refetch } = useActiveRideRequests();

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

    useEffect(() => {
    requestPermissionAndFetchLocation();
  }, [requestPermissionAndFetchLocation]);


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

  const closeRow = (rowMap: RideRowMap, rowKey: string) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const handleComplain = (rowMap: RideRowMap, rowKey: string) => {
    closeRow(rowMap, rowKey);
    console.log('Complain about ride:', rowKey);
  };

  const handleHide = (rowMap: RideRowMap, rowKey: string) => {
    closeRow(rowMap, rowKey);
    console.log('Hide ride:', rowKey);
  };

  const handleChooseOnMap = (rowMap: RideRowMap, rowKey: string) => {
    closeRow(rowMap, rowKey);
    console.log('Choose on map for ride:', rowKey);
  };

  const handleRideCardPress = (rideRequest: RideRequest) => {
    setSelectedRide(rideRequest);
    setModalVisible(true);
  };

  const handleAcceptRide = (fare: number) => {
    console.log('Accept ride with fare:', fare);
    // Handle ride acceptance logic
  };

  const handleOfferFare = (fare: number) => {
    console.log('Offer fare:', fare);
    // Handle fare offer logic
  };

  const handleEditFare = () => {
    setModalVisible(false);
    setTimeout(() => setFareInputVisible(true), 100);
  };

  const handleCustomFareOffer = (fare: number) => {
    console.log('Custom fare offer:', fare);
    setFareInputVisible(false);
    setTimeout(() => setModalVisible(true), 100);
  };

  const renderHiddenItem = (
    { item }: { item: RideRequest },
    rowMap: RideRowMap
  ) => {
    const actions = [
      {
        key: 'complain',
        label: 'Complain',
        icon: 'warning-outline' as const,
        accent: colors.danger,
        handler: () => handleComplain(rowMap, item.id),
      },
      {
        key: 'hide',
        label: 'Hide Ride',
        icon: 'eye-off-outline' as const,
        accent: colors.textSecondary,
        handler: () => handleHide(rowMap, item.id),
      },
      {
        key: 'map',
        label: 'Choose on Map',
        icon: 'location-outline' as const,
        accent: colors.primary,
        handler: () => handleChooseOnMap(rowMap, item.id),
      },
    ];
    const effectiveRailWidth = actionWidth - 16;
    const actionButtonWidth = Math.max(
      (effectiveRailWidth - ACTION_GAP * (actions.length - 1)) / actions.length,
      68
    );


    return (
      <View
        style={[
          styles.hiddenRow,
          {
            backgroundColor: colors.backgroundSecondary,
            shadowColor: colors.shadow,
            width: cardRailWidth,
          },
        ]}
      >
        <View
          style={[
            styles.hiddenActions,
            {
              width: actionWidth,
            },
          ]}
        >
          {actions.map((action) => (
            <TouchableOpacity
              key={action.key}
              style={[
                styles.actionButton,
                {
                  width: actionButtonWidth,
                  height: 52,
                  borderColor: action.accent,
                  marginHorizontal: ACTION_GAP / 2,
                  marginRight: 25,
                },
              ]}
              onPress={action.handler}
              activeOpacity={0.7}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              <Ionicons name={action.icon} size={12} color={action.accent} />
              <Text style={[styles.actionText, { color: action.accent }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <GradientBackground style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Custom Header */}
        <RideRequestsHeader />

       {/* Upcoming Ride Card */}
       {driverStatus === 'online' && (
         <View style={[styles.upcomingRideCard, { backgroundColor: colors.primaryGradient }]}>
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
      <SwipeListView
        data={activeRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RideCard
            rideRequest={item}
            onMenuPress={(rideRequest) => console.log('Menu pressed for ride:', rideRequest.id)}
            onPress={handleRideCardPress}
          />
        )}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={rightOpenValue}
        stopRightSwipe={rightOpenValue}
        leftOpenValue={0}
        stopLeftSwipe={0}
        disableLeftSwipe={false}
        disableRightSwipe
        closeOnRowPress
        swipeToOpenPercent={35}
        swipeToClosePercent={20}
        recalculateHiddenLayout
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing || isRefetching}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={<OfflineScreen isOnline={driverStatus === 'online'} />}
      />
      
      <RideDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        rideRequest={selectedRide}
        onAccept={handleAcceptRide}
        onOfferFare={handleOfferFare}
        onEditFare={handleEditFare}
      />
      
      <FareInputModal
        visible={fareInputVisible}
        onClose={() => {
          setFareInputVisible(false);
          setTimeout(() => setModalVisible(true), 100);
        }}
        onOffer={handleCustomFareOffer}
        passengerOffer={selectedRide?.estimatedFare}
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
    minHeight: 140,
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
    marginBottom: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
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
    borderRadius: 14,
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
    paddingHorizontal: LIST_HORIZONTAL_PADDING,
    paddingBottom: 64,
    paddingTop: 8,
  },
  hiddenRow: {
    minHeight: 194,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
    borderRadius: 16,
    paddingVertical: 6,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    
  },
  hiddenActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 22,
    gap: 4,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
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
