import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps,StyleProp,ViewStyle } from 'react-native';
import { BoldMonoText } from '../../../../components/text';
import AppText from '../../../../components/AppText';

interface WalletButtonProps extends TouchableOpacityProps {
  // labelStyle?: StyleProp<TextStyle>;
  // inputContainerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  title?:string;
  btnFillUp?:Boolean;
  btnViewStyle?:StyleProp<ViewStyle>;
  bgClr?:any;
}
const WalletButton: React.FC<WalletButtonProps> = props => {
  const {
  onPress,
  title,
  btnFillUp,
  btnViewStyle,
  bgClr
  } = props;

  return (
    <TouchableOpacity
    {...props}
    style={[ btnFillUp ? styles.buttonFill:styles.button,btnViewStyle ,

      {
        backgroundColor: bgClr ? bgClr : "transparent",
      },

    ]} onPress={onPress}>
   {
    btnFillUp ?
    <AppText style={styles.textFillUp}>{title}</AppText> 
    :
    <AppText style={styles.text}>{title}</AppText>
   }
    
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#221F29',
    borderRadius: 60,
    // backgroundColor: 'transparent',
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  buttonFill: {
    borderRadius: 60,
    // backgroundColor: '#719AFF',
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  text: {
    color: '#221F29',
    fontSize: 26,
    lineHeight: 34.58,
  },
  textFillUp: {
    color: 'white',
    fontSize: 26,
    lineHeight: 34.58,
  },
});

export default WalletButton;
