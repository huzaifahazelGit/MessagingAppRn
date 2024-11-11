import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { Linking, SafeAreaView, Switch, View } from "react-native";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import NavBar from "../../components/navbar";
import { colors } from "../../constants/colors";
import { useMe } from "../../hooks/useMe";
import { BodyText, BoldMonoText, BoldText } from "../../components/text";
import { TouchableOpacity } from "react-native";

export default function SubscriptionsScreen() {
  const me = useMe();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const accessLevel = useMemo(() => {
    if (me.accessLevel) {
      if (me.accessLevel == "premium_monthly") {
        return "PREMIUM";
      }
      if (me.accessLevel == "premium_yearly") {
        return "PREMIUM";
      }
    }
    return "FREE";
  }, [me.accessLevel]);

  const billingStatus = useMemo(() => {
    if (me.accessLevel) {
      if (me.accessLevel == "premium_monthly") {
        return "MONTHLY";
      }
      if (me.accessLevel == "premium_yearly") {
        return "YEARLY";
      }
    }
    return "N/A";
  }, [me.accessLevel]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <NavBar title={"My Subscriptions"} includeBack={true} />
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <BoldText>Realm Membership</BoldText>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <BodyText style={{ opacity: 0.8 }}>Membership Status</BodyText>
          <BodyText>{accessLevel}</BodyText>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <BodyText style={{ opacity: 0.8 }}>Billing</BodyText>
          <BodyText>{billingStatus}</BodyText>
        </View>

        {accessLevel == "FREE" ? (
          <TouchableOpacity
            style={{
              backgroundColor: colors.blue,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 12,
              // marginHorizontal: 12,
              marginTop: 20,
              marginBottom: 20,
              borderRadius: 20,
            }}
            onPress={() => {
              (navigation as any).navigate("PremiumUpgradeScreen", {
                kind: "generic",
              });
            }}
          >
            <BoldMonoText>Upgrade Membership</BoldMonoText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "flex-start",

              marginTop: 10,
              marginBottom: 20,
              borderRadius: 20,
            }}
            onPress={() => {
              Linking.openURL((me as any).management_url);
            }}
          >
            <View style={{ borderBottomColor: "white", borderBottomWidth: 1 }}>
              <BodyText
                style={{
                  borderBottomColor: "white",
                  borderBottomWidth: 1,
                }}
              >
                Manage Membership
              </BodyText>
            </View>
          </TouchableOpacity>
        )}

        <BoldText style={{ marginTop: 20 }}>Creator Subscriptions</BoldText>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <BodyText style={{ opacity: 0.8 }}>Coming soon.</BodyText>
          {/* <BodyText>{billingStatus}</BodyText> */}
        </View>
      </View>
    </SafeAreaView>
  );
}
