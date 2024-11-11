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

const CustomMultiTabBtn: React.FC<MultiSelectButtonsProps> = ({
  selectedButton,
  onSelect,
  options, // Destructure options prop
  purchaseFlag,
  buttonStyle
}) => {
  
 
  return (
    <View style={styles.container}>  
       
       <ScrollView style={{flex:1,}} horizontal showsHorizontalScrollIndicator={false}
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
          <Text style={{color:selectedButton === option ? "#221F29":"white",fontSize:16}}>{option}</Text>
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
    borderWidth: 1.5,
    borderColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 20,
     backgroundColor:"#7A797F"
  },
  selectedButton: {
    backgroundColor: 'white',
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

export default CustomMultiTabBtn;
