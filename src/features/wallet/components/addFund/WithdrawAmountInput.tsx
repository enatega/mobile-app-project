import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface WithdrawAmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

const WithdrawAmountInput: React.FC<WithdrawAmountInputProps> = ({
  amount,
  onAmountChange,
}) => {
  const handleTextChange = (text: string) => {
    const numericValue = text.replace(/[^0-9.]/g, "");
    onAmountChange(numericValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Enter amount <Text style={styles.required}>*</Text>
      </Text>

      <TextInput
        style={styles.input}
        placeholder="QAR  0.00"
        placeholderTextColor="#9CA3AF"
        value={amount ? `QAR  ${amount}` : ""}
        onChangeText={handleTextChange}
        keyboardType="decimal-pad"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: "400",
  },
});

export default WithdrawAmountInput;