// app/index.tsx
// Root Navigation with Three-Gate Authentication System

import { useAppSelector } from "@/src/store/hooks";
import {
    selectIsLoggedIn,
    selectIsOnboarded,
    selectTermsAccepted,
} from "@/src/store/selectors/authSelectors";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

/**
 * ═══════════════════════════════════════════════════════════
 * ROOT INDEX - THREE-GATE NAVIGATION SYSTEM
 * ═══════════════════════════════════════════════════════════
 * 
 * This component determines where users should be routed based on
 * three authentication gates:
 * 
 * 🚦 GATE 1: AUTHENTICATED
 *    ├─ Has valid JWT token
 *    └─ Stored in Redux: auth.isLoggedIn = true
 * 
 * 🚦 GATE 2: ONBOARDED
 *    ├─ Completed document submission
 *    └─ Stored in Redux: auth.isOnboarded = true
 * 
 * 🚦 GATE 3: TERMS ACCEPTED
 *    ├─ Agreed to terms & conditions
 *    └─ Stored in Redux: auth.termsAccepted = true
 * 
 * ═══════════════════════════════════════════════════════════
 * ROUTING LOGIC:
 * ═══════════════════════════════════════════════════════════
 * 
 * ❌ NOT AUTHENTICATED
 *    → /(auth)/welcome
 * 
 * ✅ AUTHENTICATED + ❌ NOT ONBOARDED
 *    → /(auth)/signupSecondStage
 * 
 * ✅ AUTHENTICATED + ✅ ONBOARDED + ❌ TERMS NOT ACCEPTED
 *    → /(auth)/terms&service
 * 
 * ✅ ALL THREE GATES PASSED
 *    → /(tabs)/(rideRequests)/rideRequest 🎉
 * 
 * ═══════════════════════════════════════════════════════════
 */

export default function RootIndex() {
  // ============================================
  // GET GATE STATUS FROM REDUX
  // ============================================
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isOnboarded = useAppSelector(selectIsOnboarded);
  const termsAccepted = useAppSelector(selectTermsAccepted);

  // ============================================
  // LOADING STATE
  // ============================================
  const [isLoading, setIsLoading] = useState(true);

  // ============================================
  // CHECK AUTH STATE ON MOUNT
  // ============================================
  useEffect(() => {
    // In production, you'd check AsyncStorage here for persisted auth
    // For now, we just check Redux state
    const checkAuthState = async () => {
      try {
        // Simulate checking persisted auth (replace with real AsyncStorage check)
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        console.log('═══════════════════════════════════════════════════════════');
        console.log('🚦 ROOT INDEX - CHECKING GATE STATUS');
        console.log('═══════════════════════════════════════════════════════════');
        console.log(`  Gate 1 (Authenticated): ${isLoggedIn ? '✅ PASSED' : '❌ LOCKED'}`);
        console.log(`  Gate 2 (Onboarded):     ${isOnboarded ? '✅ PASSED' : '❌ LOCKED'}`);
        console.log(`  Gate 3 (Terms):         ${termsAccepted ? '✅ PASSED' : '❌ LOCKED'}`);
        console.log('═══════════════════════════════════════════════════════════');
      } catch (error) {
        console.error('❌ Error checking auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, [isLoggedIn, isOnboarded, termsAccepted]);

  // ============================================
  // DEBUG: LOG GATE STATUS ON CHANGE
  // ============================================
  useEffect(() => {
    if (!isLoading) {
      console.log('🔄 Gate status changed!');
      console.log(`  Authenticated: ${isLoggedIn}`);
      console.log(`  Onboarded: ${isOnboarded}`);
      console.log(`  Terms: ${termsAccepted}`);
    }
  }, [isLoggedIn, isOnboarded, termsAccepted, isLoading]);

  // ============================================
  // SHOW LOADING SCREEN
  // ============================================
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3853A4" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // ============================================
  // GATE 1: CHECK AUTHENTICATION
  // ============================================
  if (!isLoggedIn) {
    console.log('🚫 GATE 1 LOCKED: Not authenticated');
    console.log('➡️  Redirecting to: /(auth)/welcome');
    console.log('═══════════════════════════════════════════════════════════\n');
    return <Redirect href="/(auth)/welcome" />;
  }

  // ============================================
  // GATE 2: CHECK ONBOARDING
  // ============================================
  if (!isOnboarded) {
    console.log('✅ GATE 1 PASSED: Authenticated');
    console.log('🚫 GATE 2 LOCKED: Not onboarded');
    console.log('➡️  Redirecting to: /(auth)/signupSecondStage');
    console.log('═══════════════════════════════════════════════════════════\n');
    return <Redirect href="/(auth)/signupSecondStage" />;
  }

  // ============================================
  // GATE 3: CHECK TERMS ACCEPTANCE
  // ============================================
  if (!termsAccepted) {
    console.log('✅ GATE 1 PASSED: Authenticated');
    console.log('✅ GATE 2 PASSED: Onboarded');
    console.log('🚫 GATE 3 LOCKED: Terms not accepted');
    console.log('➡️  Redirecting to: /(auth)/terms&service');
    console.log('═══════════════════════════════════════════════════════════\n');
    return <Redirect href="/(auth)/terms&service" />;
  }

  // ============================================
  // ALL GATES PASSED! 🎉
  // ============================================
  console.log('✅ GATE 1 PASSED: Authenticated');
  console.log('✅ GATE 2 PASSED: Onboarded');
  console.log('✅ GATE 3 PASSED: Terms accepted');
  console.log('🎉 ALL GATES UNLOCKED!');
  console.log('➡️  Redirecting to: /(tabs)/(rideRequests)/rideRequest');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  return <Redirect href="/(tabs)/(rideRequests)/rideRequest" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
});