import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import AppText from '../../../components/AppText';

interface CustomButtonProps extends TouchableOpacityProps {
  containerStyle?: StyleProp<ViewStyle>;
  title?:string
  // Add any other props you need for customization
}

const CustomButton: React.FC<CustomButtonProps> = ({ containerStyle,title, ...props }) => {
  return (
    <TouchableOpacity
      style={[{
        width: 125,
        height: 37,
        borderRadius: 50,
        borderWidth: 1,
        justifyContent:"center",
        alignItems:"center"
      }, containerStyle]}
      {...props}
    >
     <AppText size={14} color={"white"} >{title}</AppText>
    </TouchableOpacity>
  );
}

export default CustomButton;
