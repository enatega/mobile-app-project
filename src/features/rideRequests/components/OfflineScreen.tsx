
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EmptyStateProps {
  isOnline: boolean;
  title?: string;
  description?: string;
}

export const OfflineScreen: React.FC<EmptyStateProps> = ({ isOnline, title, description }) => {
  const { colors } = useTheme();

  const handleGoToSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  if (!isOnline) {
    return (
      <View style={styles.container}>
        <View style={styles.illustrationContainer}>
          <View style={[styles.illustration, { backgroundColor: 'rgba(22, 145, 191, 0.1)' }]}>
            <Ionicons name="car-sport-outline" size={120} color={colors.primary} />
          </View>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Turn your location on</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Your location info in needed to find ride requests in your current area
        </Text>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: '#4F46E5' }]}
          onPress={handleGoToSettings}
        >
          <Text style={styles.settingsButtonText}>Go to settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <Ionicons name="car-outline" size={64} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title ?? 'No Active Requests'}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description ?? `You're online and ready to accept rides.\nNew requests will appear here automatically.`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  illustrationContainer: {
    marginBottom: 40,
  },
  illustration: {
    width: 280,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  settingsButton: {
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 30,
    width: '100%',
    maxWidth: 400,
  },
  settingsButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default OfflineScreen;