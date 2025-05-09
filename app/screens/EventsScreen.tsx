import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const events = [
  {
    name: 'Live Concert',
    location: 'Namma Ooru, Bangalore',
    description: 'Live music performance with local bands.',
    rating: 4.5,
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
    image: 'https://assets.unileversolutions.com/v1/985812.jpg',
  },
  {
    name: 'Art Exhibition',
    location: 'Art Gallery, Whitefield',
    description: 'Exhibition of contemporary art by renowned artists.',
    rating: 4.3,
    coordinates: { latitude: 12.9698, longitude: 77.7499 },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4pH72UwsvywInVwsNx7Eu6YswXAenrtf5Qg&s',
  },
  {
    name: "Food Festival",
    location: "Cubbon Park, Bangalore",
    description: "Taste food from various global cuisines.",
    rating: 4.0,
    coordinates: { latitude: 12.9763, longitude: 77.5929 },
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtHYtXesM9t6UZMoEhDKOa7i0snUUnbYOpKQ&s"
  },
  {
    name: "IPL RCB Match",
    location: "M. Chinnaswamy Stadium, Bangalore",
    description: "Watch the Royal Challengers Bangalore take on their rivals in an exciting IPL match.",
    rating: 5,
    coordinates: { latitude: 12.9716, longitude: 77.6061 },
    image: "https://documents.iplt20.com//ipl/assets/images/stadium/M.Chinnaswamy-Stadium.webp"
  },
  {
    name: "Theater Play",
    location: "Ravindra Kalakshetra, Bangalore",
    description: "A theatrical performance of a classic play.",
    rating: 4.2,
    coordinates: { latitude: 12.9601, longitude: 77.5859 },
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlBdzvXjK7x25QTzQBzR-hcQggN_RfW77u7Q&s"
  },
  {
    name: "Rock Concert",
    location: "Whitefield Auditorium, Bangalore",
    description: "Experience the electrifying performance by a popular rock band.",
    rating: 4.6,
    coordinates: { latitude: 12.9744, longitude: 77.7107 },
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNN7fgCKOh4HDC35eXa0dX2S4x0dc-EWo9ZQ&s"
  }
];
const FAVORITES_KEY = 'FAVORITE_EVENTS';

const EventMapScreen = () => {
  const mapRef = useRef<MapView>(null);
  const [favorites, setFavorites] = useState<number[]>([]); // Store the indices of favorite events
  const [selectedRating, setSelectedRating] = useState<string>('All');

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    };
    loadFavorites();
  }, []);

  const handleCardPress = (coordinates: { latitude: number; longitude: number }) => {
    mapRef.current?.animateToRegion({
      ...coordinates,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleFavoritePress = async (index: number) => {
    const updatedFavorites = favorites.includes(index)
      ? favorites.filter((favIndex) => favIndex !== index)
      : [...favorites, index];

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites)); // Save to AsyncStorage
  };

  const renderRating = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <View style={{ flexDirection: 'row' }}>
        {[...Array(full)].map((_, i) => (
          <FontAwesome key={`f-${i}`} name="star" size={14} color="#ffa500" />
        ))}
        {half && <FontAwesome name="star-half" size={14} color="#ffa500" />}
        {[...Array(empty)].map((_, i) => (
          <FontAwesome key={`e-${i}`} name="star-o" size={14} color="#ffa500" />
        ))}
      </View>
    );
  };

  const filteredEvents = events.filter((event) => {
    if (selectedRating === 'All') return true;
    const rating = parseFloat(selectedRating);
    return event.rating >= rating; // Filter for ratings above the selected value
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Upcoming Events</Text>

   
      <Picker
        selectedValue={selectedRating}
        onValueChange={(itemValue) => setSelectedRating(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="All Ratings" value="All" />
        <Picker.Item label="5 Stars" value="5" />
        <Picker.Item label="4.5 Stars" value="4.5" />
        <Picker.Item label="4 Stars" value="4" />
        
      </Picker>

      {filteredEvents.map((event, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => handleCardPress(event.coordinates)}
        >
          <View style={styles.cardContent}>
            <Image source={{ uri: event.image }} style={styles.cardImage} />
            <View style={styles.cardText}>
              <Text style={styles.name}>{event.name}</Text>
              <Text style={styles.location}>{event.location}</Text>
              <Text style={styles.description}>{event.description}</Text>
              {renderRating(event.rating)}
            </View>
            <TouchableOpacity
              style={styles.favoriteIcon}
              onPress={() => handleFavoritePress(index)}
            >
              <FontAwesome
                name={favorites.includes(index) ? 'heart' : 'heart-o'}
                size={24}
                color={favorites.includes(index) ? 'red' : '#ccc'}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}


      <Text style={styles.heading}> Map View</Text>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 12.9716,
            longitude: 77.5946,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}
        >
          {events.map((event, index) => (
            <Marker
              key={index}
              coordinate={event.coordinates}
              title={event.name}
              description={event.location}
            />
          ))}
        </MapView>
      </View>
    </ScrollView>
  );
};

export default EventMapScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#1e3a5f',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  cardText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a5f',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 13,
    color: '#444',
    marginVertical: 6,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  favoriteIcon: {
    padding: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
});
