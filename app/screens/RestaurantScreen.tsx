import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const FAVORITES_KEY = 'FAVORITE_RESTAURANTS';



const restaurants = [
  {
    name: 'Grasshopper',
    address: '45, Kalena Agrahara, Bannerghatta Road, Bangalore 560076',
    cuisine: 'European',
    lat: 12.864437,
    lon: 77.589501,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq9HhqxCpWauvXAIAt7ai0A_urL8cLjgbHOQ&s',
  },
  {
    name: 'Edo Japanese Restaurant and   Bar ITC Gardenia',
    address: 'ITC Gardenia, 1, Residency Road, Bangalore 560025',
    cuisine: 'Japanese',
    lat: 12.971200,
    lon: 77.595500,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNNoZO6cT37G0I3HH-c5Pj914Ce7lQ-xIN6w&s',
  },
  {
    name: 'Toscano',
    address: 'UB City, Vittal Mallya Rd, Bangalore 560001',
    cuisine: 'Italian',
    lat: 12.971683,
    lon: 77.596279,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvc4Il0kmvQ4GN4_T4oEazCdP3UIW6mMY0pA&s',
  },
  {
    name: 'Farzi Cafe',
    address: 'UB City, Vittal Mallya Road, Bangalore 560001',
    cuisine: 'Modern Indian',
    lat: 12.971700,
    lon: 77.596400,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHfJiDBSYxcG63Yg_9jR-nBbSSP3efWSd4sA&s',
  },
  {
    name: 'Caperberry',
    address: 'The Estate, 48/1, Vittal Mallya Rd, Bangalore 560001',
    cuisine: 'European Fusion',
    lat: 12.971400,
    lon: 77.595800,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL6DNuKGB40JSjwPOIWAh0KWTJ8mE0VVTVJw&s',
  },
  {
    name: 'Ssaffron Shangri-La Hotel',
    address: '56-6B, Palace Road, Bangalore 560052',
    cuisine: 'North Indian',
    lat: 12.991200,
    lon: 77.586800,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhfO7jM98W_T3l_xXaT-7lLdOOOS47QxJ_Kg&s',
  },
  {
    name: 'The Fatty Bao',
    address: 'Indiranagar, Bangalore 560038',
    cuisine: 'Asian Fusion',
    lat: 12.971800,
    lon: 77.640900,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi1mGTXdDCyvObSZg-3_NypuvijliWVrS0TA&s',
  },
  {
    name: 'Rim Naam The Oberoi',
    address: 'The Oberoi, MG Road, Bangalore 560001',
    cuisine: 'Asian',
    lat: 12.973470,
    lon: 77.618695,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh2mbVY3cLnRYthDDMFI4syiOV7FRHP1Qjow&s',
  },
];

const RestaurantScreen = () => {
  const mapRef = useRef<MapView>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    };
    loadFavorites();
  }, []);

  const saveFavorites = async (favList: number[]) => {
    setFavorites(favList);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favList));
  };


  const toggleFavorite = (index: number) => {
    const newFavs = favorites.includes(index)
      ? favorites.filter((i) => i !== index)
      : [...favorites, index];
    saveFavorites(newFavs);
  };
  const handleCardPress = (lat: number, lon: number) => {
    mapRef.current?.animateToRegion({
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (selectedCuisine==='All')return true;


    return restaurant.cuisine.toLowerCase() === selectedCuisine.toLowerCase();
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Restaurants</Text>

     
      <Picker
        selectedValue={selectedCuisine}
        onValueChange={(itemValue) => setSelectedCuisine(itemValue)}
        style={styles.picker}
      >
        
        <Picker.Item label="All Cuisines" value="All" />
        <Picker.Item label="European" value="European" />
        <Picker.Item label="Japanese" value="Japanese" />
        <Picker.Item label="Italian" value="Italian" />
        <Picker.Item label="Modern Indian" value="Modern Indian" />
        <Picker.Item label="Asian" value="Asian" />
        <Picker.Item label="Asian Fusion" value="Asian Fusion" />
      </Picker>

      {filteredRestaurants.map((restaurant, index) => (
        <View key={index} style={styles.card}>
          <TouchableOpacity onPress={() => handleCardPress(restaurant.lat, restaurant.lon)} style={styles.cardRow}>
            <Image source={{ uri: restaurant.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{restaurant.name}</Text>
              <Text style={styles.details}>{restaurant.cuisine}</Text>
              <Text style={styles.details}>{restaurant.address}</Text>
    
   </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.heart}
            onPress={() => toggleFavorite(index)}
          >
            <FontAwesome
              name={favorites.includes(index) ? 'heart' : 'heart-o'}
              size={20}
              color={favorites.includes(index) ? 'red' : 'gray'}
            />

          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.header}>Map View</Text>
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
          {restaurants.map((restaurant, index) => (
            <Marker
              key={`marker-${index}`}
              coordinate={{ latitude: restaurant.lat, longitude: restaurant.lon }}
              title={restaurant.name}
              description={restaurant.address}
            />
          ))}
        </MapView>
      </View>
    </ScrollView>
  );
};
export default RestaurantScreen;


const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#1e3a5f',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    position: 'relative',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 13,
    color: '#666',
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  mapContainer: {
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
