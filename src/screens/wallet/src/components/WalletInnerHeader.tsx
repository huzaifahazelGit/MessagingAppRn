import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { BoldMonoText } from '../../../../components/text';

interface WalletHeaderProps {
  title: string;
  image:any
  onPressImage: () => void;

}

const WalletInnerHeader: React.FC<WalletHeaderProps> = ({ title, onPressImage,image }) => {
  return (
    // <View style={styles.container}>
    //   {/* <View style={{width:"40%",}} />
    //   <BoldMonoText style={styles.title}>{title}</BoldMonoText>
    //   <Pressable
    //   style={{width:"30%",alignItems:"center",justifyContent:"center",flexDirection:'column-reverse'}}
    //   onPress={onPressImage}>
    //     <Image
    //       source={image}
    //       style={styles.icon}
        
    //     />
    //   </Pressable> */}



    // </View>
    <View style={{flexDirection:"row",paddingHorizontal:20,justifyContent:"space-between", paddingTop: 20,paddingBottom:20
  }}>
      <View />
       <BoldMonoText style={styles.title}>{title}</BoldMonoText>
      <Pressable
      style={{alignItems:"center",justifyContent:"center",flexDirection:'column-reverse'}}
      onPress={onPressImage}>
        {/* <Image
          source={image}
          style={styles.icon}
        
        /> */}
      </Pressable> 

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 5,
    width:"100%",
    height:50
    
  },
  title: {
    color: '#221F29',
    fontSize: 26,
    lineHeight: 34.58,
    // width:"30%",
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: 'black',
  },
});

export default WalletInnerHeader;
