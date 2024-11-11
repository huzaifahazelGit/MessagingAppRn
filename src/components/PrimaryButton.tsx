import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome icons
import { COLORS } from "../constants/theme";

interface PrimaryButtonProps {
  title: string;
  handlePress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  containerStyles?: ViewStyle;
  textStyle?: TextStyle;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  handlePress,
  isLoading,
  disabled,
  containerStyles,
  textStyle,
  iconName,
  iconSize = 16,
  iconColor = "#fff"
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        containerStyles,
        disabled && styles.disabledButton,
      ]}
      disabled={isLoading || disabled}
    >
      <View style={styles.buttonContent}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        )}
        {iconName && (
          <FontAwesome
            name={iconName as any}
            size={iconSize}
            color={iconColor}
            style={styles.icon} // Add styling to position the icon
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "80%",
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "grey",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center", // Default positioning, overridden in Maps
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginLeft: "auto", // Ensure icon is on the right if needed
  },
});

export default PrimaryButton;
