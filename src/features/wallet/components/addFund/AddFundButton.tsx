import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface AddFundButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

const AddFundButton: React.FC<AddFundButtonProps> = ({
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>Add funds</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3853A4",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AddFundButton;