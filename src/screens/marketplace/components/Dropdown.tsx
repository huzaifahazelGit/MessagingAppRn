// CategoryDropdown.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native';

const Dropdown = ({ categories, onSelect, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(defaultValue);

  const handleSelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false);
    onSelect(category);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.dropdownButtonText}>{selectedCategory}</Text>
        <Image source={require("../assets/downArrow.png")}  style={{width:20,height:20,tintColor:"white",resizeMode:"contain",}}  />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdown}>
          {categories.map((category:any, index:any) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => handleSelect(category)}
            >
              <Text style={styles.optionText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  dropdownButton: {
    width:"100%",height:55,borderColor:"white",borderWidth:2,borderRadius:20,alignItems:"center",justifyContent:"space-between",paddingHorizontal:20,marginVertical:5,flexDirection:"row"
  },
  dropdownButtonText: {
    color: '#FFF',
    fontSize: 20,
  },
  dropdown: {
    width: '80%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 5,
    marginTop: 5,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#007BFF',
  },
  optionText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default Dropdown;
