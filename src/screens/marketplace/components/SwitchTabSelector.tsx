import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import AppText from '../../../components/AppText'; // Adjust the import path as per your project

const SwitchTabSelector = ({
  options,
  onSelect,
  conatinerBackgroundColor,
  selectedTextColor,
  unSelectedTextColor,
  tabSelectedIndex,
  setTabSelectedIndex,
  marginH
  
}) => {
  const columnWidth = 100 / options.length;

  const handleOptionSelect = (index) => {
    onSelect(index);
    setTabSelectedIndex(index);
  };

  return (
    <ScrollView
    horizontal
    contentContainerStyle={{flexGrow:1}}
    style={{flex:1}}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: conatinerBackgroundColor,
          },
          {
            marginHorizontal: marginH ? marginH : 0
          }
          
        ]}
      >
       
        {options.map((option, index) => (
          <Pressable
            key={option}
            onPress={() => handleOptionSelect(index)}
            style={[
              styles.option,
              {
                width: `${columnWidth}%`,
                elevation: tabSelectedIndex === index ? 5 : 0,
                backgroundColor: tabSelectedIndex === index ? 'white' : 'transparent',
              },
            ]}
          >
            <AppText
              size={12}
              center
              color={tabSelectedIndex === index ? selectedTextColor : unSelectedTextColor}
            >
              {option}
            </AppText>
          </Pressable>
        ))}
       

      </View>
 </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 3,
    // width: '100%',
  },
  option: {
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40, 
  },
});

export default SwitchTabSelector;
