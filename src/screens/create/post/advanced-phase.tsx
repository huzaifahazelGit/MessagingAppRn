import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import React from "react";
import { ScrollView, Switch, View } from "react-native";
import AvatarList from "../../../components/lists/avatar-list";
import { BodyText } from "../../../components/text";
import DatePickerButton from "../../../components/upload-wrappers/datepicker-button";
import UserPickerButton from "../../../components/upload-wrappers/userpicker-button";
import { colors } from "../../../constants/colors";
import { User } from "../../../models/user";
import { UploadSelectionObject } from "../upload-constants";

export const AdvancedPhase = ({
  releaseDate,
  setReleaseDate,
  uploadData,
  setUploadData,
  coauthors,
  setCoauthors,
}: {
  releaseDate: any;
  setReleaseDate: any;
  uploadData: UploadSelectionObject;
  setUploadData: any;
  coauthors: User[];
  setCoauthors: any;
}) => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          backgroundColor: colors.black,
          paddingHorizontal: 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={{ paddingHorizontal: 8, marginTop: 20 }}>
            <UserPickerButton users={coauthors} setUsers={setCoauthors}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "white",
                  borderBottomWidth: 1,
                  paddingVertical: 9,
                  alignItems: "center",
                }}
              >
                <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                  Add Co-Authors
                </BodyText>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AvatarList
                    avatars={[...coauthors].map((item) => item.profilePicture)}
                    totalCount={[...coauthors].length}
                  />

                  {coauthors.length > 0 && (
                    <BodyText style={{ marginLeft: 4 }}>{`${coauthors
                      .map((item) => item.username)
                      .join(", ")}`}</BodyText>
                  )}
                  <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color="white"
                  />
                </View>
              </View>
            </UserPickerButton>
          </View>

          {uploadData.audioObject ? (
            <View style={{ paddingHorizontal: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "white",
                  borderBottomWidth: 1,
                  paddingTop: 9,
                  paddingBottom: 4,
                  alignItems: "center",
                }}
              >
                <BodyText
                  style={{ marginLeft: 4, fontSize: 14, marginTop: -4 }}
                >
                  Downloadable
                </BodyText>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Switch
                    trackColor={{ false: "#767577", true: colors.white }}
                    thumbColor={colors.blue}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => {
                      setUploadData({
                        ...uploadData,
                        audioObject: {
                          ...uploadData.audioObject,
                          downloadable: !uploadData.audioObject.downloadable,
                        },
                      });
                    }}
                    value={uploadData.audioObject.downloadable}
                    style={{
                      transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                      marginTop: -4,
                    }}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View />
          )}

          {uploadData.audioObject ? (
            <View style={{ paddingHorizontal: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "white",
                  borderBottomWidth: 1,
                  paddingTop: 9,
                  paddingBottom: 4,
                  alignItems: "center",
                }}
              >
                <View>
                  <BodyText
                    style={{ marginLeft: 4, fontSize: 14, marginTop: -4 }}
                  >
                    Include in Jukebox
                  </BodyText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Switch
                    trackColor={{ false: "#767577", true: colors.white }}
                    thumbColor={colors.blue}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => {
                      setUploadData({
                        ...uploadData,
                        audioObject: {
                          ...uploadData.audioObject,
                          profileDisplay:
                            !uploadData.audioObject.profileDisplay,
                        },
                      });
                    }}
                    value={uploadData.audioObject.profileDisplay}
                    style={{
                      transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                      marginTop: -4,
                    }}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View />
          )}

          <View style={{ paddingHorizontal: 8 }}>
            <DatePickerButton
              includeTime={true}
              date={releaseDate}
              setDate={setReleaseDate}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "white",
                  borderBottomWidth: 1,
                  paddingVertical: 9,
                }}
              >
                <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                  Schedule Post
                </BodyText>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {releaseDate ? (
                    <BodyText style={{ fontSize: 14, color: colors.softWhite }}>
                      {moment(releaseDate).format("MMM Do hh:mm A")}
                    </BodyText>
                  ) : (
                    <View />
                  )}
                  <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color="white"
                  />
                </View>
              </View>
            </DatePickerButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
