import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CurrentBalanceDisplayProps {
  balance: number;
}

const CurrentBalanceDisplay: React.FC<CurrentBalanceDisplayProps> = ({
  balance,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current balance</Text>
      <Text style={styles.balance}>QAR{balance.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#6B7280",
  },
  balance: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
});

export default CurrentBalanceDisplay;