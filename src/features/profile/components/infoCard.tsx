import { AntDesign, Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const infoCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 20,
        paddingVertical: 12,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Feather name="user" size={24} color="black" />
        <View>
          <Text style={styles.mainText}>{title}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      </View>
      <AntDesign name="right" size={20} color="black" />
    </TouchableOpacity>
  );
};

export default infoCard;

const styles = StyleSheet.create({
  descriptionText: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    color: "#71717A",
  },
  mainText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    color: "#18181B",
  },
});
