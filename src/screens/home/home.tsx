import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location';
import * as Calendar from 'expo-calendar';
import { format } from 'date-fns';

export default function HomeScreen({ navigation }) {
  const [time, setTime] = useState(new Date());
  const [nextEvent, setNextEvent] = useState(null);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState('This is the contact’s message.');

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    fetchLocation();
    fetchNextEvent();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
  };

  const fetchWeather = async () => {
    if (!location) return;
    try {
      const api_key = "e46cd65e17c856ca33b968a0e957cef0";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${api_key}&units=metric`
      );
      const data = await response.json();
      setWeather({
        temp: data.main.temp,
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      });
    } catch (error) {
      console.log('Error fetching weather:', error);
    }
  };

  const fetchNextEvent = async () => {
    const calendarPermission = await Calendar.requestCalendarPermissionsAsync();
    const remindersPermission = await Calendar.requestRemindersPermissionsAsync();

    if (calendarPermission.status === 'granted' && remindersPermission.status === 'granted') {
      const calendars = await Calendar.getCalendarsAsync();
      const events = await Calendar.getEventsAsync(
        [calendars[0].id],
        new Date(),
        new Date(Date.now() + 24 * 60 * 60 * 1000)
      );
      if (events.length > 0) setNextEvent(events[0]);
    } else {
      console.log('Calendar and reminders permissions are required.');
    }
  };

  const navigateToWeatherDetails = () => {
    navigation.navigate('Weather', { weather });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle='default' backgroundColor="#1a237e" translucent={true} />
      
      <View style={styles.timeContainer}>
        <Icon name="clock-outline" size={30} color="#3949ab" />
        <Text style={styles.time}>{format(time, 'h:mm a')}</Text>
        <Text style={styles.date}>{format(time, 'MMMM d, yyyy')}</Text>

        {nextEvent ? (
          <View style={styles.eventCard}>
            <Icon name="calendar" size={30} color="#3949ab" style={styles.eventIcon} />
            <View>
              <Text style={styles.eventTitle}>{nextEvent.title}</Text>
              <Text style={styles.eventTime}>
                {format(new Date(nextEvent.startDate), 'h:mm a')} - {format(new Date(nextEvent.endDate), 'h:mm a')}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noEventText}>No events scheduled for today</Text>
        )}
      </View>

      <View style={styles.weatherContainer}>
        {weather ? (
          <>
            <Image source={{ uri: weather.icon }} style={styles.weatherIcon} />
            <Text style={styles.weatherTemp}>{weather.temp}°C</Text>
            <Text style={styles.weatherDesc}>{weather.description}</Text>
            <Text style={styles.weatherLocation}>Lahore, Pakistan</Text>
            <TouchableOpacity style={styles.detailsButton} onPress={navigateToWeatherDetails}>
              <Text style={styles.detailsButtonText}>More Details</Text>
            </TouchableOpacity>
          </>
        ) : (
          <ActivityIndicator size="large" color="#8e99f3" />
        )}
      </View>

      <View style={styles.messageContainer}>
        <View style={styles.messageHeader}>
          <Icon name="account" size={24} color="#5c6bc0" />
          <Text style={styles.messageTitle}>Contacts</Text>
        </View>
        <Text style={styles.messageText}>{message}</Text>
        <TouchableOpacity onPress={() =>navigation.navigate("Contacts")}>
          <Text style={styles.inboxLink}>View Inbox</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e8eaf6',
    justifyContent: 'center',
  },
  timeContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#c5cae9',
    borderRadius: 15,
    marginBottom: 20,
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a237e',
    marginVertical: 5,
  },
  date: {
    fontSize: 18,
    color: '#3949ab',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8eaf6',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    width: '80%',
  },
  eventIcon: {
    marginRight: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  eventTime: {
    fontSize: 14,
    color: '#333',
  },
  noEventText: {
    fontSize: 16,
    color: '#757de8',
    marginTop: 10,
  },
  weatherContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 20,
    backgroundColor: '#c5cae9',
    borderRadius: 15,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#283593',
    marginTop: 10,
  },
  weatherDesc: {
    fontSize: 18,
    color: '#3f51b5',
    marginBottom: 5,
  },
  weatherLocation: {
    fontSize: 14,
    color: '#757de8',
  },
  weatherIcon: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  detailsButton: {
    marginTop: 10,
    backgroundColor: '#3f51b5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3949ab',
    marginLeft: 5,
  },
  messageText: {
    fontSize: 14,
    color: '#455a64',
    marginBottom: 10,
  },
  inboxLink: {
    color: '#3f51b5',
    textAlign: 'right',
    fontWeight: 'bold',
  },
});
