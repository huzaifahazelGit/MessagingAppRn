import { Image } from "expo-image";
import { Modal, TouchableOpacity, View } from "react-native";
import { LightButton } from "../../../components/buttons/buttons";
import EmptyAudioBackground from "../../../components/images/empty-audio-background";
import { BodyText, BoldMonoText } from "../../../components/text";
import { SCREEN_HEIGHT } from "../../../constants/utils";

export const VoteModal = ({
  showingConfirm,
  setShowingConfirm,
  selectedSubmission,
  challenge,
  createVote,
}) => {
  return (
    <Modal visible={showingConfirm} transparent={true} animationType={"fade"}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setShowingConfirm(false)}
        ></TouchableOpacity>
        <View
          style={{
            height: SCREEN_HEIGHT * 0.65,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,

            justifyContent: "space-between",
          }}
        >
          <View style={{ alignItems: "center", marginTop: 30 }}>
            {selectedSubmission && selectedSubmission.image ? (
              <Image
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: 8,
                }}
                source={{ uri: selectedSubmission.image }}
                contentFit={"cover"}
              />
            ) : (
              <EmptyAudioBackground size={240} />
            )}
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {selectedSubmission ? (
                <BoldMonoText
                  style={{
                    opacity: 0.8,
                    paddingHorizontal: 8,
                    paddingBottom: 4,
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  {selectedSubmission.uploadTitle}
                </BoldMonoText>
              ) : (
                <View />
              )}
            </View>
            <BoldMonoText
              style={{
                color: "black",
                fontSize: 18,
                textAlign: "center",
                paddingHorizontal: 20,
              }}
            >{`You’re about to cast your vote in “${challenge.title}"`}</BoldMonoText>
            <BodyText style={{ color: "black", opacity: 0.5, marginTop: 20 }}>
              {challenge.allowsVoting
                ? `You can only vote once.`
                : "You can vote multiple times."}
            </BodyText>
          </View>

          <View style={{ paddingBottom: 30, paddingHorizontal: 10 }}>
            <LightButton
              submit={createVote}
              title={"CONFIRM"}
              loading={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
