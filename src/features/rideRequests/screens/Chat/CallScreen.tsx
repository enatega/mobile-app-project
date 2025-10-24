import GradientBackground from "@/src/components/common/GradientBackground";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DriverCallScreen = () => {
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);

    const profileImage = params.profileImage as string || "https://avatar.iran.liara.run/public/48";
    const driverName = params.driverName as string || "John Smith";

    const handleEndCall = () => {
        router.back();
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const toggleSpeaker = () => {
        setIsSpeakerOn(!isSpeakerOn);
    };

    return (
        <GradientBackground>
            <View style={[styles.container, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 80 }]}>
                
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: profileImage }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.nameText}>{driverName}</Text>
                    <Text style={styles.statusText}>Calling....</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={styles.iconButton}
                        onPress={toggleMute}
                    >
                        <Ionicons 
                            name={isMuted ? "mic-off" : "mic-off-outline"} 
                            size={28} 
                            color="#52525B" 
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
                            style={{ transform: [{ rotate: '135deg' }] }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.iconButton}
                        onPress={toggleSpeaker}
                    >
                        <Ionicons 
                            name={isSpeakerOn ? "volume-high" : "volume-high-outline"} 
                            size={28} 
                            color="#52525B" 
                        />
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
    statusText: {
        fontSize: 16,
        color: "#71717A",
        fontWeight: "400",
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