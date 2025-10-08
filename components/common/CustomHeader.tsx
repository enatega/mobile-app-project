// src/components/CustomHeader.tsx
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) onBackPress();
    else navigation.goBack();
  };

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 5 }]}>
      {showBackButton ? (
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          style={{ backgroundColor: "#fff", padding: 5, borderRadius: "100%" }}
        >
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 22 }} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={{ width: 22 }} />
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    zIndex: 1000,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#18181B",
    textAlign: "center",
    lineHeight: 28,
    // letterSpacing: -0.5,
  },
});
