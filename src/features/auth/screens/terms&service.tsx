// src/features/auth/screens/terms&service.tsx
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import AnimatedHeader from '../components/terms&services/animatedHeader';
import BottomFadeGradient from '../components/terms&services/bottomFadeGradient';
import ScrollControl from '../components/terms&services/scrollControl';
import TermsContent from '../components/terms&services/termSection';

// ============================================
// NEW IMPORTS - Redux Integration
// ============================================
import { useAppDispatch } from '@/src/store/hooks';
import { setTermsAccepted } from '@/src/store/slices/auth.slice';

export default function TermsAndServiceScreen() {
  const scrollY = new Animated.Value(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const insets = useSafeAreaInsets();

  const router = useRouter();
  
  // ============================================
  // USE REDUX DISPATCH
  // ============================================
  const dispatch = useAppDispatch();

  const { height: screenHeight } = Dimensions.get('window');
  const HEADER_HEIGHT = screenHeight * 0.15 + insets.top;

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollPosition = contentOffset.y;
    const scrollHeight = contentSize.height - layoutMeasurement.height;

    const atBottom = scrollPosition >= scrollHeight - 20;
    setIsAtBottom(atBottom);
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // ============================================
  // HANDLE ACCEPT - FINAL GATE!
  // ============================================
  const handleAcceptAndContinue = () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 USER ACCEPTED TERMS & CONDITIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // ============================================
    // MARK GATE 3 AS PASSED!
    // ============================================
    dispatch(setTermsAccepted(true));
    
    console.log('✅ GATE 3 PASSED: Terms Accepted');
    console.log('🎊 ALL THREE GATES NOW PASSED!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Gate 1 - Authenticated: ✅');
    console.log('Gate 2 - Onboarded: ✅');
    console.log('Gate 3 - Terms Accepted: ✅');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Navigating to Main App...');
    console.log('➡️  Route: /(tabs)/(rideRequests)/rideRequest');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // ============================================
    // NAVIGATE TO MAIN APP
    // ============================================
    // Navigation will be handled by root index.tsx
    // which checks all three gates and redirects accordingly
    router.replace("/(tabs)/(rideRequests)/rideRequest");
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <AnimatedHeader
        scrollY={scrollY}
        title="Terms of Service"
        subtitle="AGREEMENT"
        lastUpdated="Last updated on 5/12/2022"
      />

      {/* Spacer to push content below header */}
      <View style={{ height: HEADER_HEIGHT }} />

      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: false,
            listener: handleScroll,
          }
        )}
        scrollEventThrottle={16}
      >
        <TermsContent onAccept={handleAcceptAndContinue} />
      </Animated.ScrollView>

      <BottomFadeGradient isVisible={!isAtBottom} />

      <ScrollControl
        isAtBottom={isAtBottom}
        onScrollToBottom={scrollToBottom}
        onScrollToTop={scrollToTop}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
}); 