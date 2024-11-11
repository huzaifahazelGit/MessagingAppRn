// BottomSheetDropdown.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Image
} from 'react-native';

const BottomSheetDropDown = ({ categories, onSelect, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(defaultValue);

  const handleSelect = (category:any) => {
    setSelectedCategory(category);
    setIsOpen(false);
    onSelect(category);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.dropdownButtonText,{color:selectedCategory == "Select a category" ?"gray":"white"}]}>{selectedCategory}</Text>
        <Image source={require("../assets/downArrow.png")}  style={{width:20,height:20,tintColor:"white",resizeMode:"contain",}}  />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.bottomSheet}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <View style={styles.optionContainer}>
                    <View
                      style={[
                        styles.circle,
                        selectedCategory === item && styles.selectedCircle,
                      ]}
                    />
                    <Text style={styles.optionText}>{item}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  dropdownButton: {
    width:"100%",
    height:55,
    borderColor:"white",
    borderWidth:1,
    borderRadius:20,
    alignItems:"center",
    justifyContent:"space-between",
    paddingHorizontal:20,
    marginVertical:5,
    flexDirection:"row"
  },
  dropdownButtonText: {
    color: '#FFF',
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFF',
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  option: {
    paddingVertical: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#19383A',
    marginRight: 10,
  },
  selectedCircle: {
    backgroundColor: '#19383A',
  },
  optionText: {
    fontSize: 20,
  },
});

export default BottomSheetDropDown;
