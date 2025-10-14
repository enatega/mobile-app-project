import Button from '@/src/components/ui/Button /index';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RideRequest } from '../types';

interface RideDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  rideRequest: RideRequest | null;
  onAccept?: (fare: number) => void;
  onOfferFare?: (fare: number) => void;
  onEditFare?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RideDetailsModal: React.FC<RideDetailsModalProps> = ({
  visible,
  onClose,
  rideRequest,
  onAccept,
  onOfferFare,
  onEditFare,
}) => {
  const { colors } = useTheme();
  const [selectedFare, setSelectedFare] = useState<number | null>(null);

  if (!rideRequest) return null;

  const fareOptions = [
    { label: 'QAR120', value: 120 },
    { label: 'QAR130', value: 130 },
    { label: 'QAR140', value: 140 },
  ];

  const defaultFare = rideRequest.estimatedFare;

  const handleAccept = () => {
    onAccept?.(defaultFare);
    onClose();
  };

  const handleOfferFare = (fare: number) => {
    onOfferFare?.(fare);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Ride Details</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map Container */}
        <View style={[styles.mapContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <View style={styles.mapPlaceholder}>
            {/* Route visualization */}
            <View style={styles.routeVisualization}>
              <View style={[styles.carIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="car" size={20} color="#FFF" />
              </View>
              <View style={styles.routePath}>
                <View style={[styles.routeSegment, { backgroundColor: colors.primary }]} />
                <View style={[styles.routeSegment, { backgroundColor: colors.success }]} />
              </View>
              <View style={[styles.destinationIcon, { backgroundColor: colors.danger }]} />
            </View>
            
            {/* Distance and time badges */}
            <View style={[styles.distanceBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>10 min</Text>
              <Text style={styles.badgeSubtext}>3.9 km</Text>
            </View>
            <View style={[styles.timeBadge, { backgroundColor: colors.success }]}>
              <Text style={styles.badgeText}>7 min</Text>
              <Text style={styles.badgeSubtext}>3.8 km</Text>
            </View>
          </View>
        </View>

        {/* Ride Info */}
        <View style={styles.rideInfo}>
          <View style={styles.fareSection}>
            <Image 
              source={{ uri: rideRequest.passenger.profileImage || 'https://avatar.iran.liara.run/public/48' }}
              style={styles.passengerAvatar}
            />
            <View style={styles.fareDetails}>
              <Text style={[styles.fareAmount, { color: colors.text }]}>
                QAR {defaultFare.toFixed(2)}
              </Text>
              <Text style={[styles.passengerName, { color: colors.textSecondary }]}>
                {rideRequest.passenger.name}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#FACC15" />
                <Text style={[styles.rating, { color: colors.textSecondary }]}>
                  {rideRequest.passenger.rating.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>

          {/* Route Details */}
          <View style={styles.routeDetails}>
            <View style={styles.routeItem}>
              <View style={[styles.routeDot, styles.routeDotWithHole, { borderColor: colors.success }]} />
              <Text style={[styles.routeAddress, { color: colors.text }]} numberOfLines={1}>
                {rideRequest.pickupLocation.address}
              </Text>
            </View>
            <View style={styles.routeItem}>
              <View style={[styles.routeDot, styles.routeDotWithHole, { borderColor: colors.danger }]} />
              <Text style={[styles.routeAddress, { color: colors.text }]} numberOfLines={1}>
                {rideRequest.dropoffLocation.address}
              </Text>
            </View>
          </View>

          {/* Time and Distance Info */}
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>Just now</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="bicycle-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {rideRequest.distance.toFixed(1)} Km
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            title={`Accept for QAR${defaultFare.toFixed(0)}`}
            onPress={handleAccept}
            variant="primary"
            fullWidth
            style={[styles.acceptButton, { backgroundColor: colors.primary }]}
          />
          
          <Text style={[styles.offerText, { color: colors.textSecondary }]}>
            Offer your fare
          </Text>
          
          <View style={styles.fareOptions}>
            {fareOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.fareOption,
                  { 
                    borderColor: colors.border,
                    backgroundColor: selectedFare === option.value ? colors.primary : colors.background 
                  }
                ]}
                onPress={() => {
                  setSelectedFare(option.value);
                  handleOfferFare(option.value);
                }}
              >
                <Text style={[
                  styles.fareOptionText,
                  { 
                    color: selectedFare === option.value ? '#FFF' : colors.text 
                  }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={[styles.fareOption, styles.editOption, { borderColor: colors.border }]}
              onPress={() => {
                console.log('Edit button pressed in modal');
                onEditFare?.();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Close Button */}
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: colors.backgroundSecondary }]}
          onPress={onClose}
        >
          <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>Close</Text>
        </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  mapContainer: {
    height: screenHeight * 0.35,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    position: 'relative',
  },
  routeVisualization: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    right: '20%',
    height: '60%',
    alignItems: 'center',
  },
  carIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  routePath: {
    flex: 1,
    width: 4,
    justifyContent: 'space-between',
  },
  routeSegment: {
    flex: 1,
    width: 4,
    marginVertical: 2,
  },
  destinationIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  distanceBadge: {
    position: 'absolute',
    top: 40,
    right: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeBadge: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeSubtext: {
    color: '#FFF',
    fontSize: 10,
  },
  rideInfo: {
    paddingHorizontal: 20,
  },
  fareSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  passengerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
  },
  fareDetails: {
    flex: 1,
  },
  fareAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  passengerName: {
    fontSize: 14,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
  },
  routeDetails: {
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  routeDotWithHole: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  routeAddress: {
    fontSize: 14,
    flex: 1,
  },
  metaInfo: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionSection: {
    paddingHorizontal: 20,
  },
  acceptButton: {
    borderRadius: "6%",
    marginBottom: 16,
  },
  offerText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 12,
  },
  fareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  fareOption: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editOption: {
    maxWidth: 50,
  },
  fareOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RideDetailsModal;