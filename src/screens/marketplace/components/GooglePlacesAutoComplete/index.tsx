import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Image, Pressable} from 'react-native';
// import {GOOGLE_PLACES_API_KEY} from '@utils';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useTheme} from '@react-navigation/native';
import AppText from '../../../../components/AppText';
// import {AppText} from '@components';

interface Props {
  colors: any;
  title?: any;
  onChange: (data: any, details: any) => void;
  handleCloseModal?: any;
}

const GooglePlaceComplete = (props: Partial<Props>) => {
   const GOOGLE_PLACES_API_KEY = 'AIzaSyCRQbuzB7296abvanXJON4x7_PcoR_MKLo';

  const {onChange, title, handleCloseModal} = props;
  const mytheme: any = useTheme();
  const placesRef: any = useRef();
  const [searchPhrase, setSearchPhrase] = useState<any>('');
  const clearSearch = () => {
    setSearchPhrase('');
    placesRef.current.clear();
  };
  const renderLocationList = (row: any) => {
    return (
      <>
        <View style={[{flexDirection:"row",justifyContent:"space-between"}]}>
          {/* <Image source={location} style={styles.locationImg} /> */}
          <AppText medium size={12}>
            {row?.description}
          </AppText>
        </View>
      </>
    );
  };

  return (
    <>
      <GooglePlacesAutocomplete
        listViewDisplayed
        fetchDetails={true}
        placeholder={title}
        keyboardShouldPersistTaps="handled"
        nearbyPlacesAPI="GoogleReverseGeocoding"
        onPress={(data: any, details = null) => {
          if (onChange) {
            onChange(data, details);
          }
        }}
        // currentLocation={true}
        enableHighAccuracyLocation
        enablePoweredByContainer={false}
        renderDescription={(row: any) => renderLocationList(row)}
        ref={placesRef}
        textInputProps={{
          color: mytheme?.colors?.border,
          clearButtonMode: 'never',
          onChangeText: (txt: any) => {
            setSearchPhrase(txt);
          },
        }}
        styles={{
          textInput: [styles.inputStyle],
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
          listView: {
            zIndex: 1000,
            width: '100%',
          },
        }}
        query={{
          language: 'en',
          types: 'geocode',
          components: 'country:ca',
          key: GOOGLE_PLACES_API_KEY,
        }}
        // listEmptyComponent={() => (
        //   <View style={{flex: 1}}>
        //     <Text>No results were found</Text>
        //   </View>
        // )}
      />
      <View style={styles.searchView}>
        <Pressable onPress={() => handleCloseModal()}>
          {/* <Image source={} style={styles.img} /> */}
        </Pressable>
        <Pressable onPress={clearSearch}>
          <Image
            source={require("../../assets/close.png")}
            style={[styles.img, {tintColor: mytheme?.colors?.border}]}
          />
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 13,
    borderRadius: 50,
    backgroundColor: "lightgrey",
    paddingHorizontal: 50,
    fontWeight: '500',
    // fontFamily: 'Plus Jakarta Sans',
  },
  placeholderText: {
    marginTop: 25,
  },
  img: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  searchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
  },
  locationImg: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: '#4A5568',
    marginRight: 20,
  },
});

export default GooglePlaceComplete;
