import GradientBackground from "@/src/components/common/GradientBackground";
import { twilioVoiceManager } from "@/src/services/twilioVoiceManager";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DriverCallScreen = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);

  const driverId = "ce1dd6a2-8662-495e-ae04-e0b84e0e3e30";
  const customerId =
    (params.customerId as string) || "f5258cbe-d593-440d-9d9c-1203aa003513";
  const profileImage =
    (params.profileImage as string) ||
    "https://avatar.iran.liara.run/public/48";
  const customerName = (params.customerName as string) || "Customer";

  useEffect(() => {
    const initAndCall = async () => {
      try {
        console.log("[CALL SCREEN] Initializing...");
        await twilioVoiceManager.initialize(driverId);
        
        console.log("[CALL SCREEN] Making call to:", customerId);
        await twilioVoiceManager.makeCall(driverId, customerId);
        
        setIsConnecting(false);
        setIsCallActive(true);
      } catch (error) {
        console.error("[CALL SCREEN] Failed:", error);
        router.back();
      }
    };

    initAndCall();

    const unsubscribe = twilioVoiceManager.subscribe((active, connecting) => {
      setIsCallActive(active);
      setIsConnecting(connecting);
    });

    return () => unsubscribe();
  }, []);

  const handleEndCall = () => {
    console.log("[CALL SCREEN] Ending call");
    twilioVoiceManager.endCall();
    router.back();
  };

  const handleToggleMute = () => {
    const muted = twilioVoiceManager.toggleMute();
    setIsMuted(muted);
  };

  const getCallStatus = () => {
    if (isConnecting) return "Connecting...";
    if (isCallActive) return "Connected";
    return "Calling...";
  };

  return (
    <GradientBackground>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 80 },
        ]}
      >
        <View style={styles.profileSection}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <Text style={styles.nameText}>{customerName}</Text>

          <View style={styles.statusContainer}>
            {isConnecting && (
              <ActivityIndicator
                size="small"
                color="#1691BF"
                style={{ marginRight: 8 }}
              />
            )}
            <Text
              style={[
                styles.statusText,
                isCallActive && styles.statusConnected,
              ]}
            >
              {getCallStatus()}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.iconButton, isMuted && styles.iconButtonActive]}
            onPress={handleToggleMute}
            disabled={!isCallActive}
          >
            <Ionicons
              name={isMuted ? "mic-off" : "mic-off-outline"}
              size={28}
              color={isMuted ? "#DC2626" : "#52525B"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleEndCall}
          >
            <Ionicons
              name="call"
              size={32}
              color="#fff"
              style={{ transform: [{ rotate: "135deg" }] }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} disabled>
            <Ionicons name="volume-high-outline" size={28} color="#A1A1AA" />
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
};

export default DriverCallScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  nameText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#18181B",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 16,
    color: "#71717A",
    fontWeight: "400",
  },
  statusConnected: {
    color: "#16A34A", // Green when connected
    fontWeight: "600",
  },
  durationText: {
    fontSize: 14,
    color: "#A1A1AA",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  iconButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E4E4E7",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconButtonActive: {
    backgroundColor: "#FEE2E2", // Light red when muted
  },
  endCallButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#DC2626",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
