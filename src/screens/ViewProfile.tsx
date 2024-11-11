import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

type RootStackParamList = {};

const ViewProfileScreen = () => {
  const route: any = useRoute<RouteProp<RootStackParamList>>();
  const member = route?.params;

  return (
    <SafeAreaView style={styles.safeAreaViewStyle}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Member Details */}
        <View style={[styles.section, styles.smallSection]}>
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name='person-outline' size={20} color='#fff' />
            </View>
            <Text style={styles.smallSectionTitle}>First Name</Text>
          </View>
          <Text style={styles.sectionContent}>{member.firstName || "N/A"}</Text>
        </View>

        <View style={[styles.section, styles.smallSection]}>
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name='person-outline' size={20} color='#fff' />
            </View>
            <Text style={styles.smallSectionTitle}>Last Name</Text>
          </View>
          <Text style={styles.sectionContent}>{member.lastName || "N/A"}</Text>
        </View>

        <View style={[styles.section, styles.sectionWithBackground]}>
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.iconBackground}>
              <MaterialIcons name='home' size={20} color='#fff' />
            </View>
            <Text style={styles.sectionHeader}>Yellowstone Club Address</Text>
          </View>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.sectionContent}>{member.ycAddress || "N/A"}</Text>
        </View>

        <View style={styles.sectionWithBackground}>
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name='location-outline' size={20} color='#fff' />
            </View>
            <Text style={styles.sectionHeader}>Primary Address</Text>
          </View>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.sectionContent}>
            {member.primaryAddress || "N/A"}
          </Text>
          <Text style={styles.sectionTitle}>State</Text>
          <Text style={styles.sectionContent}>{member.state || "N/A"}</Text>
          <Text style={styles.sectionTitle}>City</Text>
          <Text style={styles.sectionContent}>{member.city || "N/A"}</Text>
          <Text style={styles.sectionTitle}>Zip</Text>
          <Text style={styles.sectionContent}>{member.zip || "N/A"}</Text>
          <Text style={styles.sectionTitle}>Phone</Text>
          <Text style={styles.sectionContent}>{member.phone || "N/A"}</Text>
        </View>

        <View style={[styles.section, styles.sectionWithBackground]}>
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name='business-outline' size={20} color='#fff' />
            </View>
            <Text style={styles.sectionHeader}>Office Address</Text>
          </View>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.sectionContent}>
            {member.officeAddress || "N/A"}
          </Text>
          <Text style={styles.sectionTitle}>Phone</Text>
          <Text style={styles.sectionContent}>
            {member.officePhone || "N/A"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollViewContent: {
    padding: 20,
    flexGrow: 1,
    paddingTop: Platform.OS == "ios" ? 40 : 80,
  },
  section: {
    marginBottom: 20,
  },
  smallSection: {
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  sectionWithBackground: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 15,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconBackground: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  smallSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: "#6B7280",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
});

export default ViewProfileScreen;
