import { AntDesign } from "@expo/vector-icons";
import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { BodyText, BoldText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { SCREEN_WIDTH } from "../../../constants/utils";

export default function LinkMetadataList({ linkPosts }) {
  return (
    <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
      {linkPosts.length == 0 && (
        <View
          style={{
            paddingTop: 10,
            opacity: 0.7,
          }}
        >
          <BodyText>No links.</BodyText>
        </View>
      )}
      {linkPosts.map((item) => (
        <View
          style={
            {
              // borderBottomColor: colors.transparentWhite5,
              // borderBottomWidth: 0.5,
            }
          }
          key={item.id}
        >
          <LinkPreview
            renderLinkPreview={(data) => (
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 8,
                  alignItems: "center",
                }}
              >
                <View style={{ marginRight: 8 }}>
                  {data && data.previewData && data.previewData.image ? (
                    <Image
                      style={{ width: 62, height: 62 }}
                      source={{ uri: data.previewData.image.url }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 62,
                        height: 62,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.black,
                        borderColor: colors.transparentWhite5,
                        borderWidth: 0.5,
                      }}
                    >
                      <AntDesign name="link" size={20} color="white" />
                    </View>
                  )}
                </View>
                {data && data.previewData && data.previewData.title ? (
                  <View>
                    <BoldText
                      style={{
                        marginBottom: 2,
                        width: SCREEN_WIDTH - 110,
                      }}
                    >
                      {data.previewData.title}
                    </BoldText>
                    <BodyText
                      numLines={3}
                      style={{
                        width: SCREEN_WIDTH - 110,
                      }}
                    >
                      {data.previewData.description}
                    </BodyText>
                  </View>
                ) : (
                  <BodyText
                    style={{
                      width: SCREEN_WIDTH - 110,
                    }}
                  >
                    {item.text}
                  </BodyText>
                )}
              </View>
            )}
            renderText={(data) => <View />}
            renderDescription={(data) => <BodyText>{data}</BodyText>}
            renderHeader={(data) => <BodyText>{data}</BodyText>}
            renderTitle={(data) => <BodyText>{data}</BodyText>}
            // renderLinkPreview={(data) => (
            //   <View>
            //     {data &&
            //     data.previewData &&
            //     data.previewData.image ? (
            //       <Image
            //         style={{ width: 62, height: 62 }}
            //         source={{ uri: data.previewData.image.url }}
            //       />
            //     ) : (
            //       <View
            //         style={{
            //           width: 62,
            //           height: 62,
            //           justifyContent: "center",
            //           alignItems: "center",
            //           backgroundColor: colors.black,
            //           borderColor: colors.transparentWhite5,
            //           borderWidth: 0.5,
            //         }}
            //       >
            //         <AntDesign
            //           name="link"
            //           size={20}
            //           color="white"
            //         />
            //       </View>
            //     )}
            //   </View>
            // )}
            text={item.text}
          />
        </View>
      ))}
    </View>
  );
}
