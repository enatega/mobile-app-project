import CustomText from "@/src/components/ui/Text";
import { useTheme } from "@/src/context/ThemeContext";
import { handleTruncate } from "@/src/utils";
import { AntDesign, Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const infoCard = ({
  title,
  description,
  onPress,
}: {
  title: string;
  description: string;
  onPress?: () => void;
}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Feather name="user" size={24} color={theme.colors.colorIcon} />
        <View>
          <CustomText
            variant="body"
            weight="medium"
            style={{ color: theme.colors.colorText }}
          >
            {title}
          </CustomText>
          <CustomText
            variant="caption"
            weight="medium"
            style={{ color: theme.colors.colorTextMuted }}
          >
            {handleTruncate(45, description)}
          </CustomText>
        </View>
      </View>
      <AntDesign name="right" size={20} color={theme.colors.colorIcon} />
    </TouchableOpacity>
  );
};

export default infoCard;

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
