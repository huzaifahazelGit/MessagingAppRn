import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import AppOverlay from "../../../../components/AppOverlay";
import WalletHeader from "../components/WalletHeader";
import WalletInnerHeader from "../components/WalletInnerHeader";
import WalletButton from "../components/WalletButton";
import { useRoute } from "@react-navigation/native";
import { BoldMonoText, SimpleMonoText } from "../../../../components/text";
import { Fonts } from "../../../../constants/fonts";

const Bank = ({ navigation }: any) => {
  const route: any = useRoute();
  const { type } = route?.params;
  console.log("--type-", type);
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };
  const [amount, setAmount] = useState(0);

  const handleIncrement = () => {
    setAmount(prevAmount => prevAmount + 1);
  };

  const handleDecrement = () => {
    if (amount > 0) {
      setAmount(prevAmount => prevAmount - 1);
    }
  };
  return (
    <ImageBackground
      source={require("../../../../../assets/profile_pic.png")}
      style={{ flex: 1 }}>
      <AppOverlay />
      <WalletHeader
        title='TRACK LIST'
        icon='keyboard-arrow-down'
        image={require("../../../../../assets/avatar.png")}
        
      />
      <View style={styles.walletContainer}>
        <WalletInnerHeader
          title={type == "add" ? "Add": 'Withdraw' }
          image={require("../../../../screens/wallet/assets/dots.png")}
          onPressImage={() => console.log("")}
        />
         {type === "withdraw" &&
        <View style={styles.amountView}>
          <BoldMonoText style={styles.text}>
            {"$"}
          </BoldMonoText>
          <BoldMonoText style={styles.text}>
            {"000"}
          </BoldMonoText>
          <BoldMonoText style={styles.text}>
            {"Available"}
          </BoldMonoText>
        </View>
         }  
        <View
          style={[styles.amountTextView,{paddingTop:type === "add" ? 50:30  }]}>
          <Pressable onPress={handleDecrement}>
            <BoldMonoText
              style={{ color: "#221F29", fontSize: 65, marginLeft: 20 }}>
              {"-"}
            </BoldMonoText>
          </Pressable>

          <View style={styles.amountContainer}>
            <BoldMonoText style={{ color: "#221F29", fontSize: 65  }}>
              {"$"}
            </BoldMonoText>
            <TextInput
              style={{
                fontSize: 65,
                // fontWeight: "200",
                fontFamily: "PPSupplyRegular",
              }}
              placeholder='0'
              placeholderTextColor={"#221F29"}
              keyboardType='number-pad'
              value={amount.toString()}
               onChangeText={value => setAmount(parseInt(value))}
              >
              </TextInput>
          </View>

          <Pressable onPress={handleIncrement}>
            <BoldMonoText style={{color: "#221F29", fontSize: 65, paddingRight:20 }}>
              {"+"}
            </BoldMonoText>
          </Pressable>
        </View>

        <View style={{ flex: 3,}}>
          <View style={styles.btnView}>
            {type === "add" ? (
              <>
                <View style={{ paddingBottom: 20, alignItems: "center" }}>
                  <BoldMonoText style={{ color: "#221F29", fontSize: 18 }}>
                    {"From Linked Account"}
                  </BoldMonoText>
                  <BoldMonoText style={{ color: "#221F29", fontSize: 18 }}>
                    {"to "}
                    <BoldMonoText
                      style={{
                        color: "#221F29",
                        fontSize: 18,
                        textDecorationLine: "underline",
                      }}>
                      {"Realm Wallet"}
                    </BoldMonoText>
                  </BoldMonoText>
                </View>
                <WalletButton
                  title='Add'
                  onPress={() => navigation.navigate("Bank", { type: "add" })}
                  btnFillUp
                  bgClr={'#719AFF'}
                />
              </>
            ) : (
              <>
             
               <View style={{ paddingBottom: 20, alignItems: "center" }}>
                  <BoldMonoText style={{ color: "#221F29", fontSize: 18 }}>
                    {"From Realm Wallet"}
                  </BoldMonoText>
                  <BoldMonoText style={{ color: "#221F29", fontSize: 18 }}>
                    {"to "}
                    <BoldMonoText
                      style={{
                        color: "#221F29",
                        fontSize: 18,
                        textDecorationLine: "underline",
                      }}>
                      {"Linked Account"}
                    </BoldMonoText>
                  </BoldMonoText>
                </View>
                <WalletButton
                title='Withdraw'
                onPress={() =>
                  navigation.navigate("Bank", { type: "withdraw" })
                }
                bgClr={'#719AFF'}
                btnFillUp
              />
              </>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Bank;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    borderRadius: 30,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 10,
  },
  separator: {
    paddingVertical: 5,
  },
  btnView: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 22,
    paddingBottom: 50,
  },
  walletContainer: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 5,
    borderTopLeftRadius:40,
    borderTopRightRadius:40,
  },
  amountView: {
    paddingTop: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  text:{
    color: "#221F2973", fontSize: 18
  },
  amountTextView:{
    flexDirection: "row",
    // marginTop: 20,
    justifyContent: "center",
    paddingHorizontal: 55,
    // flex:0.5,
    // alignItems:"center",
    // backgroundColor:"red"
  },
  amountContainer:{
    flexDirection: "row", paddingHorizontal: 20
  }
});
