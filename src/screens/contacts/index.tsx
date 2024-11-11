import React, { useState } from "react";
import {
  FlatList,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS } from "../../constants/theme";
export const allMembers = [
    {
      id: "1",
      firstName: "Al",
      lastName: "Gogerchin",
      phone: "",
      state: "MT",
      country: "USA",
    },
    {
      id: "2",
      firstName: "Alfred",
      lastName: "Fisher",
      phone: "",
      state: "MT",
      country: "USA",
    },
    {
      id: "3",
      firstName: "Amelia",
      lastName: "Thompson",
      phone: "0000000000",
      state: "MT",
      country: "USA",
    },
    {
      id: "4",
      firstName: "Anna",
      lastName: "Baker",
      phone: "",
      state: "MT",
      country: "USA",
    },
    {
      id: "5",
      firstName: "Annabel",
      lastName: "Bradley",
      phone: "",
      state: "MT",
      country: "USA",
    },
    {
      id: "6",
      firstName: "Antonia",
      lastName: "Vassilatos",
      phone: "",
      state: "MT",
      country: "USA",
    },
    {
      id: "7",
      firstName: "Ariann",
      lastName: "Crudo",
      phone: "",
      state: "MT",
      country: "USA",
    },
    {
      id: "8",
      firstName: "Arthur",
      lastName: "Zsitvay",
      phone: "",
      state: "MT",
      country: "USA",
    },
    {
      id: "9",
      firstName: "Ashley",
      lastName: "Bradley",
      phone: "",
      state: "MT",
      country: "USA",
    },
    {
      id: "10",
      firstName: "Ashley",
      lastName: "Fischer",
      phone: "9498733045",
      state: "MT",
      country: "USA",
    },
    {
      id: "11",
      firstName: "Audrey",
      lastName: "Dyer",
      phone: "",
      state: "MT",
      country: "USA",
    },
    {
      id: "12",
      firstName: "August",
      lastName: "Fischer-Neubauer",
      phone: "",
      state: "MT",
      country: "USA",
    },
    {
      id: "13",
      firstName: "Betty",
      lastName: "Carter",
      phone: "",
      state: "CA",
      country: "USA",
    },
    {
      id: "14",
      firstName: "Brian",
      lastName: "Williams",
      phone: "",
      state: "CA",
      country: "USA",
    },
    {
      id: "15",
      firstName: "Charlie",
      lastName: "Davies",
      phone: "",
      state: "NY",
      country: "USA",
    },
    {
      id: "16",
      firstName: "David",
      lastName: "Evans",
      phone: "",
      state: "NY",
      country: "USA",
    },
    {
      id: "17",
      firstName: "Emma",
      lastName: "Frost",
      phone: "",
      state: "TX",
      country: "USA",
    },
    {
      id: "18",
      firstName: "Frank",
      lastName: "Garcia",
      phone: "",
      state: "TX",
      country: "USA",
    },
    {
      id: "19",
      firstName: "George",
      lastName: "Henderson",
      phone: "",
      state: "FL",
      country: "USA",
    },
    {
      id: "20",
      firstName: "Hannah",
      lastName: "Ibrahim",
      phone: "",
      state: "FL",
      country: "USA",
    },
    {
      id: "21",
      firstName: "Ian",
      lastName: "Jones",
      phone: "",
      state: "WA",
      country: "USA",
    },
    {
      id: "22",
      firstName: "Jack",
      lastName: "King",
      phone: "",
      state: "WA",
      country: "USA",
    },
    {
      id: "23",
      firstName: "Karen",
      lastName: "Lewis",
      phone: "",
      state: "OR",
      country: "USA",
    },
    {
      id: "24",
      firstName: "Larry",
      lastName: "Morris",
      phone: "",
      state: "OR",
      country: "USA",
    },
    {
      id: "25",
      firstName: "Mike",
      lastName: "Nelson",
      phone: "",
      state: "NV",
      country: "USA",
    },
    {
      id: "26",
      firstName: "Nina",
      lastName: "Owens",
      phone: "",
      state: "NV",
      country: "USA",
    },
    {
      id: "27",
      firstName: "Olivia",
      lastName: "Parker",
      phone: "",
      state: "AZ",
      country: "USA",
    },
    {
      id: "28",
      firstName: "Paul",
      lastName: "Quinn",
      phone: "",
      state: "AZ",
      country: "USA",
    },
    {
      id: "29",
      firstName: "Quincy",
      lastName: "Reed",
      phone: "",
      state: "CO",
      country: "USA",
    },
    {
      id: "30",
      firstName: "Rachel",
      lastName: "Smith",
      phone: "",
      state: "CO",
      country: "USA",
    },
    {
      id: "31",
      firstName: "Steve",
      lastName: "Taylor",
      phone: "",
      state: "UT",
      country: "USA",
    },
    {
      id: "32",
      firstName: "Tom",
      lastName: "Upton",
      phone: "",
      state: "UT",
      country: "USA",
    },
    {
      id: "33",
      firstName: "Ursula",
      lastName: "Vance",
      phone: "",
      state: "ID",
      country: "USA",
    },
    {
      id: "34",
      firstName: "Victor",
      lastName: "Watson",
      phone: "",
      state: "ID",
      country: "USA",
    },
    {
      id: "35",
      firstName: "Wendy",
      lastName: "Xavier",
      phone: "",
      state: "MT",
      country: "USA",
    },
    {
      id: "36",
      firstName: "Xander",
      lastName: "Young",
      phone: "",
      state: "MT",
      country: "USA",
    },
    {
      id: "37",
      firstName: "Yasmine",
      lastName: "Zimmer",
      phone: "",
      state: "CA",
      country: "USA",
    },
    {
      id: "38",
      firstName: "Zach",
      lastName: "Avery",
      phone: "",
      state: "CA",
      country: "USA",
    },
  ];
const Contacts = ({navigation}) => {
  const [search, setSearch] = useState("");
  const [filteredMembers, setFilteredMembers] = useState(allMembers);
  const [currentLetter, setCurrentLetter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleLetterPress = (letter: any) => {
    setCurrentLetter(letter);
    setSearch("");
    setCurrentPage(1);
    const filtered = allMembers.filter((member) =>
      member.firstName.startsWith(letter)
    );
    setFilteredMembers(filtered);
  };

  const handleSearch = (text: any) => {
    setSearch(text);
    setCurrentLetter(null); // Reset letter filter when searching
    setCurrentPage(1);
    const filtered = allMembers.filter(
      (member) =>
        member.firstName.toLowerCase().includes(text.toLowerCase()) ||
        member.lastName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  const loadMore = () => {
    if (currentPage * itemsPerPage < filteredMembers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderMember = ({ item }: any) => (
    <View style={styles.memberContainer}>
      <Image source={require("../../../assets/user.png")} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>
          {item.firstName} {item.lastName}
        </Text>
        {item.phone ? (
          <Text style={styles.phoneText}>📞 {item.phone}</Text>
        ) : null}
        <Text style={styles.locationText}>
          {item.state}, {item.country}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.viewProfileButton}
        // onPress={() => router.push("./ViewProfile")}
        onPress={()=>navigation.navigate("ViewProfile",item)} 
        >
               {/* navigtaion.navigate(
                "ViewProfile",
                params: item, // Passing parameters
              ) */}
        <Text style={styles.viewProfileText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const paginatedMembers = filteredMembers.slice(0, currentPage * itemsPerPage);

  return (
    <SafeAreaView style={styles.safeAreaViewstyle}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Banner Image */}
        <Image
          source={require("../../../assets/memberDirectoryBanner.jpeg")}
          style={styles.imageBackground}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder='Search by name...'
            value={search}
            onChangeText={handleSearch}
          />
        </View>

        {/* Alphabet Filter (A-Z Buttons) */}
        <View style={styles.alphabetContainer}>
          {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
            <TouchableOpacity
              key={letter}
              style={styles.letterButton}
              onPress={() => handleLetterPress(letter)}>
              <Text style={styles.letterText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Members List */}
        <FlatList
          data={paginatedMembers}
          keyExtractor={(item) => item.id}
          renderItem={renderMember}
          style={styles.membersList}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewstyle: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  imageBackground: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  alphabetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  letterButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
  },
  letterText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  membersList: {
    paddingHorizontal: 20,
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
  },
  phoneText: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  viewProfileButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  viewProfileText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});

export default Contacts;
