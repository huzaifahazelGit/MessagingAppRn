import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';

const RefreshScreen = ({ navigation }) => {
  useEffect(() => {
    // Handle re-authentication or re-initiation of onboarding
    Alert.alert("Refresh", "Please restart the onboarding process.");
    // Optionally, trigger accountSetup again or navigate accordingly
    navigation.navigate("MarketScreen");
  }, []);

  return (
    <View>
      <Text>Refreshing...</Text>
    </View>
  );
};

export default RefreshScreen;