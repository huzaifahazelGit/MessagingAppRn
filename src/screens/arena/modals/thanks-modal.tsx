import { Feather } from "@expo/vector-icons";
import { Modal, TouchableOpacity, View } from "react-native";
import { BodyText, BoldMonoText } from "../../../components/text";
import { SCREEN_HEIGHT } from "../../../constants/utils";

export const ThanksModal = ({ showingThanks, setShowingThanks }) => {
  return (
    <Modal visible={showingThanks} transparent={true} animationType={"fade"}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setShowingThanks(false)}
        ></TouchableOpacity>
        <View
          style={{
            height: SCREEN_HEIGHT * 0.25,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,

            alignItems: "center",
            paddingTop: 40,
          }}
        >
          <Feather name="check-circle" size={40} color="black" />
          <BoldMonoText
            style={{ color: "black", fontSize: 18, marginTop: 10 }}
          >{`Thanks for submitting!`}</BoldMonoText>
          <BodyText style={{ color: "black", opacity: 0.5, marginTop: 20 }}>
            Results will be published on announcement date.
          </BodyText>
        </View>
      </View>
    </Modal>
  );
};
