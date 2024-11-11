import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";

interface LinearButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  buttonStyle?:StyleProp<ViewStyle>;
  textStyle?: object;
}

const LinearButton: React.FC<LinearButtonProps> = ({
  title,
  onPress,
  colors = ['#007bff', '#0056b3'],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  buttonStyle,
  textStyle,
}) => {
  return (
    <TouchableOpacity
    onPress={onPress} style={buttonStyle}>
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        style={[styles.button, buttonStyle]}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff', // default text color
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LinearButton;
