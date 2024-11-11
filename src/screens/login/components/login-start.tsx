import React, { useState } from "react";
import { TouchableOpacity, SafeAreaView, View } from "react-native";
import { LightButton } from "../../../components/buttons/buttons";
import { BoldMonoText, Headline } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { Image } from "expo-image";

export default function Start({
  status,
  setStatus,
}: {
  status: "none" | "login" | "signup";
  setStatus: any;
}) {
  const [didClick, setDidClick] = useState(false);

  if (!didClick) {
    return (
      <Image
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: "black",
        }}
        source={require("../../../../assets/login-background.png")}
      >
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              setDidClick(true);
            }}
          >
            <View
              style={{
                alignItems: "center",
              }}
            >
              <BoldMonoText style={{ color: "white", fontSize: 16 ,fontWeight:'bold' }}>
                Welcome to App Rocket.
              </BoldMonoText>
              <BoldMonoText style={{ color: "white", fontSize: 16 }}>
                Let's get started.
              </BoldMonoText>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </Image>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "black",
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 250,
              height: 100,
              marginBottom: 40,
              tintColor:"purple"
            }}
            contentFit="contain"
            source={require("../../../../assets/appRocketLogo.png")}
          />
          <BoldMonoText style={{ color: "white", fontSize: 16, marginTop: 90 }}>
            Somewhere within
          </BoldMonoText>
          <BoldMonoText style={{ color: "white", fontSize: 16 }}>
            the noise.
          </BoldMonoText>
        </View>

        <View style={{ width: "100%", paddingHorizontal: 20 }}>
          <LightButton
            submit={() => setStatus("signup")}
            title={"Create Account".toUpperCase()}
            loading={false}
            color={colors.white}
            textColor="black"
            style={{
              marginBottom: 20,
            }}
          />

          <LightButton
            outline={true}
            submit={() => setStatus("login")}
            title={"Log in".toUpperCase()}
            loading={false}
            style={{
              marginBottom: 20,
              borderColor: "white",
            }}
            textColor="white"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
