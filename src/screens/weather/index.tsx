import React, { useEffect, useState, useCallback } from "react";
import { Modal, View, Text, Image, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { getNextFiveDays } from "../../services/helperFuncations";
import { getWeatherForecast, WeatherList,WeatherItem as WeatherItemType, } from "../../services/weatherApi";
import { COLORS } from "../../constants/theme";
import CustomTabs from "../../components/CustomTabs";
import PrimaryButton from "../../components/PrimaryButton";

const WeatherModal: React.FC<{
  visible: boolean;
  item: WeatherItemType | null;
  onClose: () => void;
}> = ({ visible, item, onClose }) => {
  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Weather Details</Text>
          <Image style={styles.modalImage} source={{ uri: item.iconUrl }} />

          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Time:</Text> {item.time}
          </Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Temperature:</Text> {item.temperature}
          </Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Feels Like:</Text> {item.feelsLike}
          </Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Humidity:</Text> {item.humidity}
          </Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Weather:</Text> {item.weather}
          </Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Wind Speed:</Text> {item.windSpeed}
          </Text>

          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Visibility:</Text> {item.visibility}
          </Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Description:</Text> {item.description}
          </Text>
          <PrimaryButton title="Close" handlePress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const WeatherItem: React.FC<{ item: WeatherItemType; onPress: () => void }> = React.memo(({ item, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.listContainer}>
    <Image style={styles.image} source={{ uri: item.iconUrl }} />
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={styles.row}>
        <Text>{`Time : ${item.time}`}</Text>
        <Text>{`Feels Like : ${item.feelsLike}`}</Text>
      </View>
      <View style={styles.row}>
        <Text>{`Temperature : ${item.temperature}`}</Text>
        <Text>{`Humidity : ${item.humidity}`}</Text>
      </View>
    </View>
  </TouchableOpacity>
));

export default function MainPage() {
  const [tabs, setTabs] = useState(() => getNextFiveDays());
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<WeatherList[]>([]);
  const [currentForecast, setCurrentForecast] = useState<WeatherItemType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);



  const openModal = useCallback((item: WeatherItemType) => {
    setCurrentForecast(item);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setCurrentForecast(null);
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Image source={require("../../../assets/weatherBanner.jpeg")} style={styles.imageBackground} />
        <CustomTabs index={selectedTab} setIndex={setSelectedTab} routes={tabs} />
        <View style={{ backgroundColor: COLORS.primary }}>
          <Text style={styles.title}>{tabs[selectedTab].full}</Text>
        </View>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={forecast[tabs[selectedTab].key]}
            renderItem={({ item }) => <WeatherItem item={item} onPress={() => openModal(item)} />}
            keyExtractor={(item, index) => index.toString()}
          />
        )}

        <WeatherModal visible={modalVisible} item={currentForecast} onClose={closeModal} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  listContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  imageBackground: {
    width: "100%",
    height: 200,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: 10,
  },
  title: {
    color: "white",
    textAlign: "center",
    padding: 10,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    paddingBottom: 10,
    borderRadius: 10,
    alignItems: "center",
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: COLORS.primary,
    color: "white",
    width: "100%",
    padding: 10,
    textAlign: "center",
  },
  modalImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  modalLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  modalText: {
    marginVertical: 2,
    fontSize: 16,
  },
});
