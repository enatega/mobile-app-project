import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

const TAB_BAR_BACKGROUND = '#1F2937';
const ACTIVE_TINT_COLOR = '#1691BF';
const INACTIVE_TINT_COLOR = '#9CA3AF';

const TAB_CONFIG = [
  {
    name: '(rideRequests)',
    title: 'Ride requests',
    icon: 'list-circle',
  },
  {
    name: '(scheduledRides)',
    title: 'Scheduled Rides',
    icon: 'calendar-sharp',
  },
  {
    name: '(Wallet)',
    title: 'Wallet',
    icon: 'wallet-sharp',
  },
];

function TabBarIcon({ 
  name, 
  color,
  focused
}: { 
  name: string;
  color: string;
  focused: boolean;
}) {
  // Map of icons with their focused and unfocused variants
  const iconMap: Record<string, { focused: any; unfocused: any }> = {
    'list-circle': { focused: 'list-circle', unfocused: 'list-circle-outline' },
    'calendar-sharp': { focused: 'calendar', unfocused: 'calendar-outline' },
    'wallet-sharp': { focused: 'wallet', unfocused: 'wallet-outline' },
  };

  const iconName = iconMap[name] 
    ? (focused ? iconMap[name].focused : iconMap[name].unfocused)
    : name;

  return (
    <Ionicons 
      size={Platform.OS === 'ios' ? 24 : 28} 
      name={iconName as any} 
      color={color} 
    />
  );
}

export default function BottomTabsNavigator() {
  return (
    <Tabs
      initialRouteName="(rideRequests)"
      screenOptions={{
        tabBarActiveTintColor: ACTIVE_TINT_COLOR,
        tabBarInactiveTintColor: INACTIVE_TINT_COLOR,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: TAB_BAR_BACKGROUND,
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
          paddingTop: 8,
          position: 'absolute',
          overflow: 'hidden',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      {TAB_CONFIG.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon 
                name={icon}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}