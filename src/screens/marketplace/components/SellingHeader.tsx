import React from 'react';
import { Pressable, StyleSheet, View, Image, ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';

interface SellingHeaderProps {
  title: string;
  titleSize?: number;
  titleColor?: string;
  imageSource?: ImageSourcePropType;
  [key: string]: any; // Allows for additional props
}

const SellingHeader: React.FC<SellingHeaderProps> = ({
  title,
  titleSize = 20,
  titleColor = 'white',
  imageSource = require('../assets/close.png'),
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container} >
      <AppText size={titleSize} color={titleColor}>
        {title}
      </AppText>
      <Pressable onPress={() => navigation.goBack()}>
        <Image source={imageSource} style={styles.image} />
      </Pressable>
    </View>
  );
}

export default SellingHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#231F29',
    paddingVertical: 10,
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: 'white',
  },
});
