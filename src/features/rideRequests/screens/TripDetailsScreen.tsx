import { Colors } from "@/src/constants";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RatingModal from "../components/RatingModal";
import RideMap from "../components/RideMap";
import rideRequestsService from "../services";

const { height } = Dimensions.get("window");

export const TripDetailsScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const [rideStatus, setRideStatus] = useState('in_progress');
    const [modalRatingVisible, setModalRatingVisible] = useState(false);
    const [rideData, setRideData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [waitingTime, setWaitingTime] = useState(900); // 15 * 60




    const handleChatButtonPress = () => {
        router.push("/(tabs)/(rideRequests)/chatScreen")
    }

    const handleCallButtonPress = () => {
        router.push({
            pathname: "/(tabs)/(rideRequests)/callScreen",
            params: {
                profileImage: rideData?.passengerUser?.profile_image || "https://avatar.iran.liara.run/public/48",
                driverName: rideData?.passengerUser?.name || "John Doe"
            }
        });
    };

    const fetchActiveRide = async () => {
        try {
            const data = await rideRequestsService.acceptRideRequest();
            console.log("✅ Ride result:", data);
            setRideData(data);
        } catch (err: any) {
            console.error("❌ Error fetching active ride:", err);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchActiveRide()

    }, [])



    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (rideStatus === "in_progress") {
            interval = setInterval(() => {
                setWaitingTime((prev) => prev + 1);
            }, 1000); // increase every second
        } else {
            if (interval) clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [rideStatus]);


    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const origin = {
        latitude: rideData?.pickup?.lat ?? 0,
        longitude: rideData?.pickupLocation?.lng ?? 0,
    };

    const destination = {
        latitude: rideData?.dropoff?.lat ?? 0,
        longitude: rideData?.dropoff?.lng ?? 0,
    };


    return (
        <View style={{ flex: 1, }}>

            <RideMap
                origin={origin}
                destination={destination}
                rideRequest={rideData} />


            <View style={[styles.etaBar, { paddingTop: insets.top }]}>
                {rideStatus === 'in_progess' ? (
                    <>
                        <View style={styles.leftEtaSection}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </View>
                        <View style={styles.timerWrapper}>
                            <Text style={styles.etaText}>{formatTime(waitingTime)}</Text>
                        </View>
                    </>
                ) : (


                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.cancelText}>Waiting time </Text>
                            <Text style={styles.etaText}>{formatTime(waitingTime)}</Text>
                        </View>
                    </>

                )

                }
            </View>


            {/* Bottom Card */}
            <View style={styles.bottomCard}>
                <View style={styles.bottomCardStyle}>
                    <View style={styles.leftSection}>
                        <Image
                            source={{ uri: rideData?.passengerUser?.profile_image || "https://avatar.iran.liara.run/public/48" }}
                            style={styles.profileImage}
                        />
                        <Text style={styles.name}>{rideData?.passengerUser?.name || "John Doe"}</Text>
                        <Text style={styles.rating}>⭐ {rideData?.passengerUser?.averageRating || '0'}</Text>
                        <Text style={styles.rides}>{rideData?.passengerUser?.noOfReviewsReceived || '0'}</Text>
                    </View>

                    {/* Middle Section */}
                    <View style={styles.middleSection}>
                        <View style={styles.section}>
                            <Image
                                source={require("@/assets/images/toIcon.png")}
                                style={styles.iconImage}
                            />
                            <Text style={styles.value}>{rideData?.pickup_location || "Bahria University, Bahria University, Taxi zone (Taxi zone)"}</Text>
                        </View>

                        <View style={styles.section}>
                            <Image
                                source={require("@/assets/images/fromIcon.png")}
                                style={styles.iconImage}
                            />
                            <Text style={styles.value}>{rideData?.dropoff_location || "St 16 914 (Bahria Town, Phase 8)"}</Text>
                        </View>

                        <Text style={styles.priceTxt}>QAR {rideData?.agreed_price}</Text>
                    </View>

                    {/* Right Section */}
                    <View style={styles.rightSection}>
                        <TouchableOpacity style={styles.iconButton} onPress={handleCallButtonPress}>
                            <Ionicons name="call-outline" size={18} color="#27272A" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={handleChatButtonPress}>
                            <MaterialCommunityIcons name="message-reply-text-outline" size={18} color="#27272A" />
                        </TouchableOpacity>
                    </View>


                </View>


                <RatingModal
                    visible={modalRatingVisible}
                    onClose={() => setModalRatingVisible(false)}
                    onSubmit={(rating) => {
                        console.log("Rating submitted:", rating);
                        router.replace("/(tabs)/(rideRequests)/rideRequest")

                    }}
                />

            </View>
            <TouchableOpacity
                style={[
                    styles.button, { marginBottom: insets.bottom + 70 },
                    rideStatus === "started" || rideStatus === "completed"
                        ? { backgroundColor: Colors.light.primary }
                        : { backgroundColor: Colors.light.success }
                ]}
                onPress={() => {
                    if (rideStatus === "in_progress") {
                        setRideStatus("started");
                    } else if (rideStatus === "started") {
                        setRideStatus("completed");
                    } else if (rideStatus === "completed") {
                        console.log("Show ride completed modal here");
                        setModalRatingVisible(true);
                    }
                }}
            >
                {rideStatus === "in_progress" ? (
                    <Text style={styles.buttonText}>I’m Here</Text>
                ) : rideStatus === "started" ? (
                    <Text style={styles.buttonText}>Start ride</Text>
                ) : (
                    <Text style={styles.buttonText}>Ride Completed</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({

    etaBar: {
        position: "absolute",
        top: 20,
        alignSelf: "center",
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
    },
    etaText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    etaSubText: {
        fontSize: 12,
        color: "#666",
    },
    leftEtaSection: {
        flexDirection: "column",
        alignItems: "flex-start",
        // backgroundColor: '#fff',
        padding: 10,
    },
    bottomCardStyle: {
        backgroundColor: Colors.dark.text,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        paddingTop: 20,
        flexDirection: 'row',
        alignItems: "flex-start",
        marginBottom: 5,
        // height: height * 0.18,
    },
    bottomCard: {
        position: "absolute",
        bottom: 0,
        height: height * 0.40,
        width: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 6,
        elevation: 6,

    },
    section: {
        marginBottom: 15,
        flexDirection: 'row',
        gap: 4,
        width: '80%',

    },
    title: {
        fontSize: 14,
        color: "#888",
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: Colors.light.success,
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    leftSection: {
        alignItems: "center",
        marginRight: 15,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 30,
        marginBottom: 6,
    },
    iconImage: {
        width: 15,
        height: 15,

    },
    name: {
        fontSize: 14,
        fontWeight: "600",
    },
    rating: {
        fontSize: 13,
        color: "#333",
    },
    rides: {
        fontSize: 12,
        color: "grey",
    },
    middleSection: {
        flex: 1,
        justifyContent: "center",
    },

    rightSection: {
        justifyContent: "space-around",
        alignItems: "center",
    },
    iconButton: {
        marginVertical: 6,
        borderWidth: 1,
        borderRadius: 20,
        padding: 5,
        borderColor: "#1691BF",
    },
    icon: {
        fontSize: 22,
    },
    priceTxt: {
        fontSize: 16,
        marginLeft: 20,
        color: Colors.light.danger
    },

    cancelText: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 4,
    },

    timerWrapper: {
        alignItems: "center",
    },

});
