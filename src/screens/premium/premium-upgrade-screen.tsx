import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import * as ScreenOrientation from "expo-screen-orientation";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, View } from "react-native";
import { TouchableOpacity } from "react-native";
import Purchases, { PurchasesPackage } from "react-native-purchases";
import { BoldMonoText, Headline, SimpleMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { IS_ANDROID, PREMIUM_IS_TURNED_ON } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";

export default function PremiumUpgradeScreen() {
  const me = useMe();
  const navigation = useNavigation();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
  }, []);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    console.log("loadOfferings");
    try {
      const offerings = await Purchases.getOfferings();
      console.log("offerings", offerings);
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        setPackages(offerings.current.availablePackages);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const purchasePackage = async () => {
    if (selectedPackage) {
      try {
        const { customerInfo, productIdentifier } =
          await Purchases.purchasePackage(selectedPackage);
        console.log("customerInfo", customerInfo);
        await updateDoc(doc(getFirestore(), "users", me.id), {
          accessLevel:
            selectedPackage.packageType == "MONTHLY"
              ? "premium_monthly"
              : "premium_yearly",
        });
        navigation.goBack();
      } catch (e) {
        console.log("e", e);
        if (!e.userCancelled) {
          Alert.alert("Error", `${e}`);
        }
      }
    }
  };

  return (
    <Image
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "black",
      }}
      source={require("../../../assets/login-background.png")}
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: IS_ANDROID ? 40 : 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingTop: 20,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ width: 50 }}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
          <Image
            source={require("../../../assets/icon-white.png")}
            style={{ width: 60, height: 40 }}
            contentFit="contain"
          />
          <View style={{ width: 50 }}></View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Headline style={{ marginBottom: 20 }}>Upgrade to Premium</Headline>
          <BoldMonoText
            style={{ marginBottom: 4, textAlign: "center" }}
          >{`Access the full suite of Realm features.\nGet started now.`}</BoldMonoText>
        </View>
        <View style={{}}>
          <FreePackageDisplay setSelectedPackage={setSelectedPackage} />
          {packages.map((p) => (
            <PackageDisplay
              p={p}
              key={p.identifier}
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
            />
          ))}
          <View style={{ opacity: selectedPackage ? 1 : 0.5 }}>
            <TouchableOpacity
              style={{
                marginHorizontal: 20,
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 20,
                backgroundColor: colors.white,
                justifyContent: "center",
                alignItems: "center",

                paddingHorizontal: 14,
                paddingVertical: 12,

                marginTop: 24,
              }}
              onPress={purchasePackage}
            >
              <BoldMonoText style={{ color: colors.blue, fontSize: 18 }}>
                Subscribe
              </BoldMonoText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Image>
  );
}

const PackageDisplay = ({
  p,
  selectedPackage,
  setSelectedPackage,
}: {
  p: PurchasesPackage;
  selectedPackage: PurchasesPackage;
  setSelectedPackage: any;
}) => {
  const isSelected = useMemo(() => {
    return p.identifier == selectedPackage?.identifier;
  }, [p, selectedPackage]);

  return (
    <TouchableOpacity
      style={{
        marginHorizontal: 20,
        borderColor: "white",
        backgroundColor: isSelected ? colors.blue : "transparent",
        borderWidth: 2,
        borderRadius: 8,
        flexDirection: "row",

        paddingHorizontal: 14,
        paddingVertical: 8,
        paddingBottom: 14,
        marginTop: 14,
      }}
      onPress={() => {
        setSelectedPackage(p);
      }}
    >
      <View style={{ marginRight: 20 }}>
        <Headline>{p.product.priceString}</Headline>
        <SimpleMonoText>{`/${
          p.packageType == "MONTHLY" ? "month" : "year"
        }`}</SimpleMonoText>
      </View>
      <View>
        <Headline>
          {`${p.packageType == "MONTHLY" ? "Monthly" : "Yearly"}`} Subscription
        </Headline>

        <BoldMonoText
          style={{ marginBottom: 0 }}
        >{`• unlimited posts`}</BoldMonoText>
        <BoldMonoText
          style={{ marginBottom: 0 }}
        >{`• complete access to RAI`}</BoldMonoText>
        <BoldMonoText
          style={{ marginBottom: 0 }}
        >{`• exclusive challenges`}</BoldMonoText>
        <BoldMonoText
          style={{ marginBottom: 0 }}
        >{`• creator subscriptions`}</BoldMonoText>
      </View>
    </TouchableOpacity>
  );
};

const FreePackageDisplay = ({
  setSelectedPackage,
}: {
  setSelectedPackage: any;
}) => {
  return (
    <View style={{ opacity: 1 }}>
      <TouchableOpacity
        style={{
          marginHorizontal: 20,
          borderColor: "white",
          backgroundColor: "transparent",
          borderWidth: 2,
          borderRadius: 8,
          flexDirection: "row",

          paddingHorizontal: 14,
          paddingVertical: 8,
          paddingBottom: 14,
          marginTop: 14,
        }}
        onPress={() => {
          setSelectedPackage(null);
        }}
      >
        <View style={{ marginRight: 20 }}>
          <Headline>{"FREE"}</Headline>
        </View>
        <View>
          <Headline>{`Limited Access`}</Headline>
          <BoldMonoText
            style={{ marginBottom: 0 }}
          >{`• only 5 posts per month`}</BoldMonoText>
          <BoldMonoText
            style={{ marginBottom: 0 }}
          >{`• limited access to RAI`}</BoldMonoText>
          <BoldMonoText
            style={{ marginBottom: 0 }}
          >{`• limited challenge entry`}</BoldMonoText>
        </View>
      </TouchableOpacity>
    </View>
  );
};
