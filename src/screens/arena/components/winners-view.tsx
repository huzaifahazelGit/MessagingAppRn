import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import ProfileImage from "../../../components/images/profile-image";
import { BodyText, BoldMonoText } from "../../../components/text";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { Challenge } from "../../../models/challenge";

export default function WinnersView({ challenge }: { challenge: Challenge }) {
  const [loaded, setLoaded] = useState(false);
  const [winners, setWinners] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    setLoaded(false);
    loadWinners();
  }, []);

  const loadWinners = async () => {
    let promises = [];
    challenge.winnerIds.forEach((userId) => {
      const docRef = doc(getFirestore(), "users", userId);
      promises.push(
        getDoc(docRef).then((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    let users = await Promise.all(promises);
    setWinners(users);
    setLoaded(true);
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <BoldMonoText
          style={{
            fontSize: 18,
            textAlign: "center",
            paddingHorizontal: 20,
            marginBottom: 12,
          }}
        >{`CHALLENGE WINNERS:`}</BoldMonoText>
      </View>

      <View style={{ height: 120 }}>
        <ScrollView
          style={{ height: 120 }}
          contentContainerStyle={{
            minWidth: SCREEN_WIDTH - 40,
            justifyContent: "center",
            alignItems: "center",
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ height: 120 }}>
            {loaded ? (
              winners.map((winner) => {
                return (
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 10,
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                    key={winner.id}
                    onPress={() => {
                      (navigation as any).navigate("ProfileStack", {
                        screen: "ProfileScreen",
                        params: { userId: winner.id },
                      });
                    }}
                  >
                    <ProfileImage
                      border={true}
                      size={80}
                      user={winner}
                      includeBlank={true}
                    />
                    <BodyText
                      style={{
                        marginTop: 4,
                        width: 80,
                        textAlign: "center",
                      }}
                    >
                      {winner.username}
                    </BodyText>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View
                style={{
                  width: SCREEN_WIDTH - 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
