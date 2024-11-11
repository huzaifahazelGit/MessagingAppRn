import React from 'react';
import { View, Pressable, Text, StyleSheet, ScrollView,StyleProp ,ViewStyle} from 'react-native';
import { SimpleMonoText } from '../../../components/text';

interface MultiSelectButtonsProps {
  selectedButton: string | null;
  onSelect: (buttonName: string) => void;
  options: string[]; // Add options prop;
  purchaseFlag:  boolean
  buttonStyle?:StyleProp<ViewStyle>;
}

const MultiSelectButtons: React.FC<MultiSelectButtonsProps> = ({
  selectedButton,
  onSelect,
  options, // Destructure options prop
  purchaseFlag,
  buttonStyle
}) => {
  return (
    <View style={styles.container}>
      {
        purchaseFlag &&
        <View style={{flexDirection:"row",alignItems:"center",paddingLeft:20}}>
        <SimpleMonoText 
        style={{fontSize:18,}}
        >
        {'PURCHASE'}
        </SimpleMonoText>
        <View style={styles.dot} />
        <SimpleMonoText 
        style={{fontSize:18,paddingLeft:10}}
        >
        {'|'}
        </SimpleMonoText>
        </View>
      }
      
       
   <ScrollView style={{flex:1,paddingHorizontal:15}} horizontal showsHorizontalScrollIndicator={false}
    contentContainerStyle={{flexGrow:1,}}
    >

      {options.map((option, index) => (
        <Pressable
          key={index}
          style={[
            styles.button,
            selectedButton === option && styles.selectedButton,
            buttonStyle
          ]}
          onPress={() => onSelect(option)}
        >
          <Text style={styles.buttonText}>{option}</Text>
        </Pressable>
      ))}
   </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: "center",
  },
  button: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 20,
  },
  selectedButton: {
    backgroundColor: '#669AFF',
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    color: "white"
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 5,
    backgroundColor: '#D887FF',
    marginLeft:10
  },
});

export default MultiSelectButtons;
