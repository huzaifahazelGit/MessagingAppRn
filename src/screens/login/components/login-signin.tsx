import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { LightButton } from "../../../components/buttons/buttons";
import { BodyText, BoldMonoText, Headline } from "../../../components/text";
import { Fonts } from "../../../constants/fonts";
import IconInput from "./icon-input";

export default function SignIn({
  status,
  setStatus,
  email,
  setEmail,
  password,
  setPassword,
  submit,
  loading,
}: {
  status: "none" | "login" | "signup";
  setStatus: any;
  email: string;
  password: string;
  setEmail: any;
  setPassword: any;
  submit: any;
  loading: boolean;
}) {
  return (
    <View
      style={{ width: "100%", paddingHorizontal: 20, marginTop: 30, flex: 1 }}
    >
      <View
        style={{ flex: 1, justifyContent: "center", paddingHorizontal: 14 }}
      >
        <View style={{ marginBottom: 20 }}>
          <BoldMonoText style={{}}>
            {status == "signup" ? `LET'S GET STARTED` : `WELCOME BACK.`}
          </BoldMonoText>
        </View>
        <View style={{}}>
          <IconInput
            leftAlign={true}
            placeholder={"Email"}
            value={email}
            setValue={setEmail}
            keyboardType={"email-address"}
          />
        </View>

        <View style={{ marginTop: 30 }}>
          <IconInput
            leftAlign={true}
            placeholder={"Password"}
            value={password}
            setValue={setPassword}
            secureTextEntry={true}
          />
        </View>
      </View>

      <LightButton
        submit={submit}
        title={status == "signup" ? "CREATE ACCOUNT" : "Log in"}
        loading={loading}
        style={{
          marginBottom: 20,
          marginTop: 30,
          marginHorizontal: 14,
        }}
      />
    </View>
  );
}
