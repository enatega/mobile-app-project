import { Colors } from "@/src/constants";
import { RootState } from "@/src/store/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import RatingModal from "../components/RatingModal";
import RideMap from "../components/RideMap";
import rideRequestsService from "../services";
import Shimmer from "../utils/Shimmer";

const { height } = Dimensions.get("window");

export const TripDetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [rideStatus, setRideStatus] = useState("in_progress");
  const [modalRatingVisible, setModalRatingVisible] = useState(false);
  const [rideData, setRideData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [waitingTime, setWaitingTime] = useState(900); // 15 * 60
  const { currency } = useSelector((state: RootState) => state.appConfig);


  // ✅ TODO: Replace with actual IDs from your ride data/auth system
  const driverId = "ce1dd6a2-8662-495e-ae04-e0b84e0e3e30"; // Hardcoded for testing
  const customerId = "f5258cbe-d593-440d-9d9c-1203aa003513"; // Hardcoded for testing
  const customerName = "John Doe"; // Get from ride data
  const customerAvatar = "https://avatar.iran.liara.run/public/48"; // Get from ride data

  const handleChatButtonPress = () => {
    router.push("/(tabs)/(rideRequests)/chatScreen");
  };

  const handleCallButtonPress = () => {
    // ✅ Navigate to call screen with customer details
    router.push({
      pathname: "/(tabs)/(rideRequests)/callScreen",
      params: {
        customerId: customerId,
        customerName: customerName,
        profileImage: customerAvatar,
      },
    });
  };

 const rideStart = async (rideId: any) => {
        console.log("calling ride start:", rideId)

        try {
            const data = await rideRequestsService.startMyRide(rideId);
            console.log("my ride data", data)
            if (data?.message === 'Ride status updated to IN_PROGRESS successfully') {
                setRideStatus("completed");

            }


        } catch (error: any) {
            console.log("Starting a ride error:", error.response)
        }
    }
    const rideCompleted = async (rideId: any) => {
        console.log("calling ride start:", rideId)

        try {
            const data = await rideRequestsService.completeMyRide(rideId);
            console.log("my ride data", data)
            if (data?.message === 'Ride completed successfully') {
                setModalRatingVisible(true);

            }

         

        } catch (error: any) {
            console.log("completing a ride error:", error.response)
        }
    }

    const fetchActiveRide = useCallback(async () => {
        try {
            const data = await rideRequestsService.acceptRideRequest();
            console.log("✅ Ride result:", data);

            setRideData(data);


        } catch (err) {
            console.error("❌ Error fetching active ride:", err);
        } finally {
            setLoading(false);
        }
    }, []); // dependencies here if it depends on something (e.g. userId)


    const giveRating = async (ratingData: { comment: string; rating: number }) => {
        try {
            console.log("Rating submitted:", ratingData);

            const rideId = await rideRequestsService.getMyRiderId();
            console.log("Rider ID response:", rideId);

            const payload = {
                description: ratingData.comment,
                rating: ratingData.rating,
                reviewedId: rideId?.riderId,
            };

            const result = await rideRequestsService.giveDriverRating(payload);
            console.log("Server response:", result);
            router.replace("/(tabs)/(rideRequests)/rideRequest")

        } catch (error) {
            console.log("Error giving rating:", error);
        }
    };





    useEffect(() => {
        fetchActiveRide()

    }, [fetchActiveRide])

    useEffect(() => {
        if (!rideData) {
            return;
        }
        if (rideData.status === "ASSIGNED") {
            setRideStatus("started")

        } else if (rideData.status === 'IN_PROGRESS') {
            setRideStatus("completed");
        }

    }, [rideData])


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
    const origin = useMemo(() => {
        return {
            latitude: rideData?.pickup?.lat ?? 0,
            longitude: rideData?.pickup?.lng ?? 0,
        };
    }, [rideData]);

    const destination = useMemo(() => {
        return {
            latitude: rideData?.dropoff?.lat ?? 0,
            longitude: rideData?.dropoff?.lng ?? 0,
        };
    }, [rideData]);






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


            {/* Navigate Button */}
            <TouchableOpacity style={styles.navigateButton}>
                <Ionicons name="navigate" size={24} color="#fff" />
                <Text style={{ color: "#fff", marginTop: 4, fontSize: 16, fontWeight: "600" }}>Navigate</Text>
            </TouchableOpacity>

            {/* Bottom Card */}
            <View style={styles.bottomCard}>
                <View style={styles.bottomCardStyle}>
                    <View style={styles.leftSection}>
                        {loading ? (
                            <Shimmer width={60} height={60} borderRadius={30} />
                        ) : (

                            <Image
                                source={{ uri: rideData?.passengerUser?.profile_image || "https://avatar.iran.liara.run/public/48" }}
                                style={styles.profileImage}
                            />
                        )

                        }
                        {loading ? (

                            <Shimmer width="70%" height={18} />
                        ) : (
                            <Text style={styles.name}>{rideData?.passengerUser?.name}</Text>
                        )

                        }
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
                            {loading ? (
                                <Shimmer width="90%" height={24} />
                            ) : (

                                <Text numberOfLines={3} style={styles.value}>{rideData?.pickup_location}</Text>
                            )

                            }
                        </View>

                        <View style={styles.section}>
                            <Image
                                source={require("@/assets/images/fromIcon.png")}
                                style={styles.iconImage}
                            />
                            {loading ? (
                                <Shimmer width="90%" height={24} />
                            ) : (

                                <Text numberOfLines={3} style={styles.value}>{rideData?.dropoff_location}</Text>
                            )

                            }
                        </View>
                        {loading ? (
                            <Shimmer width="70%" height={18} />
                        ) : (

                            <Text style={styles.priceTxt}>{currency?.code} {rideData?.agreed_price}</Text>
                        )

                        }


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

                        giveRating(rating);



                    }}
                />

            </View>
            {loading ? (
                <View style={{ marginBottom: insets.bottom + 60, alignItems: "center", }}>
                    <Shimmer width="90%" height={40} borderRadius={20} />
                </View>

            ) : (
                <TouchableOpacity
                    style={[
                        styles.button, { marginBottom: insets.bottom + 60 },
                        rideStatus === "started" || rideStatus === "completed"
                            ? { backgroundColor: Colors.light.primary }
                            : { backgroundColor: Colors.light.success }
                    ]}
                    onPress={() => {
                        if (rideStatus === "in_progress") {
                            setRideStatus("started");
                        } else if (rideStatus === "started") {
                            rideStart(rideData?.rideId);

                        } else if (rideStatus === "completed") {
                            rideCompleted(rideData?.rideId);
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
            )

            }
        </View>
  );
};

const styles = StyleSheet.create({
  etaBar: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    width: "90%",
    backgroundColor: "#fff",
    paddingVertical: 12,
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
    padding: 10,
  },
  bottomCardStyle: {
    backgroundColor: Colors.dark.text,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  bottomCard: {
    position: "absolute",
    bottom: 0,
    height: height * 0.4,
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
    flexDirection: "row",
    gap: 4,
    width: "80%",
  },
  title: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    flex: 1,
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
    width: 80,
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
    marginTop: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
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
    color: Colors.light.danger,
    fontWeight: "bold",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  timerWrapper: {
    alignItems: "center",
  },
  navigateButton: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    gap: "2",
    bottom: height * 0.4 + 10,
    left: 20,
    backgroundColor: "#000000",
    width: 140,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
});
