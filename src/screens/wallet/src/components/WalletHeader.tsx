import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BoldMonoText } from '../../../../components/text';
import { useNavigation } from '@react-navigation/native';

interface WalletHeaderProps {
  icon: string;
  title: string;
  image: any;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({ icon, title,image }) => {
  const navigation =useNavigation()
  return (
    <View style={[styles.headerContainer,{marginTop:40}]}>
      <View style={styles.row}>
        <MaterialIcons name={icon} size={25} color="white" />
        <BoldMonoText style={styles.headerText}>
          {title}
        </BoldMonoText>
      </View>
      <Pressable >
      <Image 
        source={image} 
        style={styles.avatar}
      />
      </Pressable>

    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 30,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    paddingLeft: 10,
  },
  avatar: {
    width: 21,
    height: 21,
    marginTop: 3,
  },
});

export default WalletHeader;
