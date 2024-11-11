// Location_Post.js
import React,{useEffect, useState,useRef, useCallback} from 'react';
import { StyleSheet, Image, View, SafeAreaView, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Modal } from 'react-native';
import AppText from '../../../components/AppText';
import WalletButton from '../../wallet/src/components/WalletButton';
import { useNavigation } from '@react-navigation/native';
import { realm_poular } from '../../wallet/src/data';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useFocusEffect } from '@react-navigation/native';

const Location_Post = ({ visible, onClose,onSelectLocation }) => {
  const navigation = useNavigation();
  const [item] = useState(realm_poular);
   const GOOGLE_PLACES_API_KEY = 'AIzaSyAXvMwecvC9QMdjMXZjPOiyUWCjq5gYvuE';
   const [selectedLocation, setSelectedLocation] = useState(null);
   const googlePlacesRef = useRef(null);
   const [location, setLocation] = useState('');

   useEffect(() => {
    if (visible) {
      googlePlacesRef.current?.focus();
    }
  }, [visible]);

  useFocusEffect(
    useCallback(() => {
      if (visible) {
        googlePlacesRef.current?.focus();
      }
    }, [visible])
  );  

  const handleAddBtn = () => {
    onSelectLocation(location);
    // setLocation('');
    // onClose();
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <AppText size={20} color={"white"}>LOCATION</AppText>
          <TouchableOpacity onPress={onClose}>
            <Image source={require("../assets/close.png")} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ flex: 1, justifyContent: "center" }}>
                {/* <GooglePlacesAutocomplete
                  ref={googlePlacesRef}
                  placeholder="Type a place"
                  onPress={(data, details = null) => console.log(data, details)}
                  
                  query={{key: GOOGLE_PLACES_API_KEY}}
                  fetchDetails={true}
                  onFail={error => console.log(error)}
                  onNotFound={() => console.log('no results')}
                  styles={{
                    container: {
                      flex: 0,
                    },
                    textInput: {
                      fontSize: 26,
                      color: "white",
                      borderBottomWidth: 2,
                      borderBottomColor: "white",
                      backgroundColor:"#231F29",
                      paddingBottom: 10,
                    },
                    description: {
                      color: '#000',
                      fontSize: 16,
                    },
                    predefinedPlacesDescription: {
                      color: '#3caf50',
                    },
                  }}
              /> */}
              <TextInput 
                ref={googlePlacesRef}
                  style={styles.textInput}
                  placeholder="Type a place"
                  placeholderTextColor="white"
                  onChangeText={setLocation}
                  value={location}
                  
                />
              </View>   
              <View style={{ paddingBottom: 20, flex: 1, justifyContent: "flex-end" }}>    
                <WalletButton
                  btnViewStyle={styles.addButton}
                  title='ADD'
                  onPress={() => handleAddBtn()}
                  btnFillUp={true}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#231F29",
  },
  header: {
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  closeIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: "white",
  },
  textInput: {
    fontSize: 26,
    color: "white",
    borderBottomWidth: 2,
    borderBottomColor: "white",
    paddingBottom: 10,
  },
  addButton: {
    width: '100%',
    height: 50,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "white",
  },
});

export default Location_Post;
