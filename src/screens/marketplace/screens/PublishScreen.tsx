// screens/marketplace/screens/PublishScreen.js
import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';

const PublishScreen = ({ navigation }) => {
  useEffect(() => {
    // Handle post-onboarding actions here
    Alert.alert("Success", "Stripe onboarding completed successfully!");
    // Navigate to a desired screen, e.g., MarketScreen
    navigation.navigate("MarketScreen");
  }, []);

  return (
    <View>
      <Text>Publishing...</Text>
    </View>
  );
};

export default PublishScreen;