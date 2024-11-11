import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { colors } from "../../constants/colors";
import { MAPS_KEY } from "../../constants/env";
import { Fonts } from "../../constants/fonts";
import { IS_IOS } from "../../constants/utils";
import { BackButton } from "../buttons/buttons";
import { BoldMonoText } from "../text";

export default function LocationButton({ setLocation, children }) {
  const [showModal, setShowModal] = useState(false);

  const addLocation = async () => {
    setShowModal(true);
    // Location.setGoogleApiKey(MAPS_KEY);

    // let { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== "granted") {
    //   setErrorMsg("Permission to access location was denied");
    //   return;
    // }

    // let loc = await Location.getCurrentPositionAsync({});
    // let result = await Location.reverseGeocodeAsync({
    //   latitude: loc.coords.latitude,
    //   longitude: loc.coords.longitude,
    // });
    // if (result.length > 0) {
    //   let locItem = result[0];
    //   if (locItem.city) {
    //     if (locItem.country != "United States") {
    //       setLocation(`${locItem.city}, ${locItem.country}`);
    //     } else {
    //       setLocation(`${locItem.city}, ${locItem.region}`);
    //     }
    //   }
    // }
  };

  return (
    <View>
      <TouchableOpacity onPress={addLocation}>{children}</TouchableOpacity>
      <Modal visible={showModal}>
        <LocationPickerInnerModal
          setShowModal={setShowModal}
          setLocation={setLocation}
          confirmLocation={() => {
            setShowModal(false);
          }}
        />
      </Modal>
    </View>
  );
}

export function LocationPickerInnerModal({
  setShowModal,
  setLocation,
  confirmLocation,
}) {
  const [listViewDisplayed, setListViewDisplayed] = useState(true);
  const ref = useRef();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 14,
        }}
      >
        <BackButton customBack={() => setShowModal(false)} />
        <BoldMonoText style={{}}>{`Location`.toUpperCase()}</BoldMonoText>
        <View style={{ width: 30 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={IS_IOS ? "padding" : "height"}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 50 }}>
            <GooglePlacesAutocomplete
              ref={ref}
              placeholder="Search"
              onPress={(data, details = null) => {
                setLocation(data.description);
                // if (ref && ref.current) {
                //   console.log("ref", ref);
                //   // @ts-ignore
                //   ref.current.focus();
                // }
              }}
              keyboardShouldPersistTaps="handled"
              renderRow={(data) => {
                return (
                  <View
                    style={{
                      backgroundColor: colors.black,
                      paddingVertical: 8,
                      zIndex: 100,
                    }}
                  >
                    <BoldMonoText style={{ fontSize: 18 }}>
                      {data.description}
                    </BoldMonoText>
                  </View>
                );
              }}
              keepResultsAfterBlur={listViewDisplayed}
              suppressDefaultStyles={true}
              listUnderlayColor={colors.black}
              styles={{ backgroundColor: colors.black }}
              enablePoweredByContainer={false}
              textInputHide={false}
              textInputProps={{
                autoFocus: true,
                style: {
                  height: 40,
                  width: "100%",
                  backgroundColor: "transparent",
                  borderBottomColor: colors.softWhite,
                  borderBottomWidth: 1,
                  paddingBottom: 4,
                  fontSize: 18,
                  fontFamily: Fonts.MonoBold,
                  color: colors.white,
                },

                placeholder: "Location...",
              }}
              query={{
                key: MAPS_KEY,
                language: "en",
              }}
            />
          </View>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 25,
              marginHorizontal: 20,
              marginBottom: 8,
            }}
            onPress={() => {
              confirmLocation();
            }}
          >
            <BoldMonoText style={{ fontSize: 22 }}>ADD</BoldMonoText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
