import { AntDesign } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { MiniProfileCardProps } from "../types";

const MiniPofileCard = ({
  userDetails,
}: {
  userDetails: MiniProfileCardProps;
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <Image
          style={styles.image}
          source={{ uri: userDetails.profile }}
        />
        <View>
          <Text style={styles.userName}>{userDetails.name}</Text>
          <Text style={styles.userEmail}>{userDetails.email}</Text>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        <View style={styles.starComponent}>
          <AntDesign name="star" size={20} color="#FBC02D" />
          <Text style={styles.ratingText}>{userDetails.rating}</Text>
        </View>
        <Text style={styles.reviewCount}>
          {Number(userDetails.totalReviews) > 0
            ? userDetails.totalReviews
            : null}
        </Text>
      </View>
    </View>
  );
};

export default MiniPofileCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  image: {
    resizeMode: "contain",
    height: 64,
    width: 64,
    borderRadius: 32,
  },
  userName: {
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0,
    color: "#18181B",
  },
  userEmail: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    color: "#71717A",
  },
  ratingContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  starComponent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  ratingText: {
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0,
    color: "#18181B",
  },
  reviewCount: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    color: "#1F2937",
  },
});
