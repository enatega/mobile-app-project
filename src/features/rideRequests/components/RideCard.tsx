import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { RideRequest } from '../types';

interface RideCardProps {
  rideRequest: RideRequest;
  onMenuPress?: (rideRequest: RideRequest) => void;
}

export const RideCard: React.FC<RideCardProps> = ({ rideRequest, onMenuPress }) => {
  const { colors } = useTheme();

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress(rideRequest);
    }
  };

  const getRideTypeColor = (rideType: string) => {
    switch (rideType) {
      case 'scheduled':
        return { background: '#FEF3C7', text: '#92400E' }; // Amber
      case 'standard':
        return { background: '#D1FAE5', text: '#065F46' }; // Green
      case 'hourly':
        return { background: '#DBEAFE', text: '#1E40AF' }; // Blue
      default:
        return { background: '#D1FAE5', text: '#065F46' }; // Default to Standard
    }
  };

  const getRideTypeLabel = (rideType: string) => {
    switch (rideType) {
      case 'scheduled':
        return 'Scheduled';
      case 'standard':
        return 'Standard';
      case 'hourly':
        return 'Hourly';
      default:
        return 'Standard';
    }
  };
  
  const rideType = rideRequest.rideType || 'standard';
  const badgeColors = getRideTypeColor(rideType);
  const badgeLabel = getRideTypeLabel(rideType);

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.mainContent}>
        {/* Left Column */}
        <View style={styles.leftColumn}>
          <Image
            source={{ uri: 'https://avatar.iran.liara.run/public/48' }}
            style={styles.customerImage}
          />
          <View style={styles.passengerInfo}>
                <Text style={[styles.customerName, { color: colors.text }]} numberOfLines={1}>
                  {rideRequest.passenger.name.split(' ')[0]}...
                </Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFA500" />
                  <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                    {rideRequest.passenger.rating}
                  </Text>
                </View>
                <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                  {/* add the total rides count */}
                     (742)
                </Text>
             </View>
        </View>

        {/* Middle Column */}
        <View style={styles.middleColumn}>
          <View style={styles.topRow}>
            <Text style={[styles.fareAmount, { color: colors.text }]}>
              QAR {rideRequest.estimatedFare.toFixed(2)}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: badgeColors.background }]}>
              <Text style={[styles.statusBadgeText, { color: badgeColors.text }]}>
                {badgeLabel}
              </Text>
            </View>
          </View>

          <Text style={[styles.locationLabel, { color: colors.text }]}>
            N.38 St. 118
          </Text>
          <Text style={[styles.locationAddress, { color: colors.textSecondary }]} numberOfLines={1}>
            {rideRequest.pickupLocation.address}
          </Text>
          
          <View style={styles.bottomRow}>
             
             <View style={styles.rideMetadata}>
                <View style={styles.metadataItem}>
                  <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.metadataText, { color: colors.textSecondary }]}>
                    Just now
                  </Text>
                </View>
                <View style={styles.metadataItem}>
                  <Ionicons name="bicycle-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.metadataText, { color: colors.textSecondary }]}>
                    {rideRequest.distance} Km
                  </Text>
                </View>
            </View>
          </View>
           {(rideRequest.rideType === 'scheduled' || rideRequest.specialInstructions) && (
            <View style={styles.additionalInfo}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.additionalInfoText, { color: colors.textSecondary }]}>
                {rideRequest.rideType === 'scheduled'
                  ? 'Thu, Sep 19. 10:30 PM'
                  : rideRequest.specialInstructions || 'Scheduled for 2 hours'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Right Column (Menu Button) */}
      {/* <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
        <Ionicons name="ellipsis-vertical" size={24} color="#6B7280" />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    // flex: 0.2,
    maxWidth: 60,
    marginRight: 12,
  },
  customerImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  middleColumn: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fareAmount: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  locationLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
  },
  locationAddress: {
    fontSize: 13,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
     marginBottom: 12,
  },
  passengerInfo: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
    marginTop: 12,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  rideMetadata: {
    flexDirection: 'row',
    gap: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    fontSize: 12,
    marginLeft: 4,
  },
  additionalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 8,
  },
  additionalInfoText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  menuButton: {
    paddingLeft: 12,
    paddingVertical: 4,
  },
});

export default RideCard;