import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image,


    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const attractions = [
  {
    title: 'Lalbagh Botanical Garden',
    location: 'Mavalli, Bangalore',
    description: 'A famous botanical garden with a glass house.',
    rating: 4.6,
    coordinates: { latitude: 12.9507, longitude: 77.5848 },
    image: 'https://sceneloc8.com/wp-content/uploads/2024/03/Lalbagh-Botanical-Garden-4.png',
  },
  {
    title: 'Bangalore Palace',
    location: 'Vasanth Nagar, Bangalore',
    description: 'A royal palace with Tudor-style architecture.',
    rating: 4.1,
    coordinates: { latitude: 12.9987, longitude: 77.5921 },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAYUa7x89sYf_286w__RKM8jWQ1N7ovddebw&s',
  },
  {
    title: 'Bannerghatta National Park',
    location: 'Bannerghatta Road, Bangalore',
    description: 'Wildlife park with safari, zoo, and butterfly park.',
    rating: 4.2,
    coordinates: { latitude: 12.8000, longitude: 77.5770 },
    image: 'https://images.deccanherald.com/deccanherald/2024-01/36dc281c-a157-43e2-8d8d-cf8220d449ad/652213.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true',
  },
  {
    title: 'Cubbon Park',
    location: 'Bangalore',
    description: 'Cubbon Park is a large green park in the center of Bangalore, popular for its serene walking paths, lush gardens, and towering trees.',
    rating: 4.5,
    coordinates: { latitude: 12.978159, longitude: 77.595213 },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRakqiGtIgCzCi3UMYiCNxDD-T6zW8C_ki7PQ&s',
  },
  {
    title: 'ISKCON Temple',
    location: 'Rajajinagar, Bangalore',
    description: 'The ISKCON Temple in Bangalore is a spiritual and architectural wonder. It is dedicated to Lord Krishna and is a major tourist attraction.',
    rating: 4.7,
    coordinates: { latitude: 13.009516, longitude: 77.551214 },
    image: 'https://www.trawell.in/admin/images/upload/148027305ISKCONTemple_Main.jpg',
  },
  {
    title: 'Jawaharlal Nehru Planetarium',
    location: 'Bangalore',
    description: 'The Jawaharlal Nehru Planetarium in Bangalore is a great place to explore the mysteries of the universe with its interactive exhibits and shows.',
    rating: 4,
    coordinates: { latitude: 12.984925, longitude: 77.580754 },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxL45XJHGEZyYRR6Vc7wUjiAA_5h6tjTKk6g&s',
  },
];

const FAVORITES_KEY = 'FAVORITE_ATTRACTIONS';

const AttractionsScreen = () => {
  const mapRef = useRef<MapView>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedRating, setSelectedRating] = useState(0); // Stat for ratig filter

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
    mapRef.current?.animateToRegion({...coordinates,latitudeDelta: 0.01,longitudeDelta: 0.01,});
  };
 const toggleFavorite = async (index: number) => {
    const updated = favorites.includes(index)
      ? favorites.filter(i => i !== index)
      : [...favorites, index];
    setFavorites(updated);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };
  const renderStars = (rating: number) =>{
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
  // Filter attractions on rating
  const filteredAttractions = attractions.filter(
    (attraction) => attraction.rating >= selectedRating
  );

  return  (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Top Attractions</Text>

      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Filter by Rating:</Text>
        <Picker
          selectedValue={selectedRating}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedRating(itemValue)}
        >
          <Picker.Item label="All" value={0} />
          <Picker.Item label="3.5" value={3.5}/>
          <Picker.Item label="4.0" value={4.0} />
          <Picker.Item label="4.5" value={4.5} />
        </Picker>
      </View>
      
      {filteredAttractions.map((item, index) => (
        <View key={index} style={styles.card}>
  <TouchableOpacity  onPress={()=>handleCardPress(item.coordinates)}>
    <View style={styles.cardContent}>
      <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.description}>{item.description}</Text>
                 {renderStars(item.rating)}
              </View>
              <TouchableOpacity onPress={() =>toggleFavorite(index)} style={styles.heartIcon}>
                <FontAwesome
                  name={favorites.includes(index) ? 'heart' : 'heart-o'}
                   size={24}
                  color={favorites.includes(index) ? 'red' : '#ccc'}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.heading}>Map View</Text>
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


          {filteredAttractions.map((item, index) => (
            <Marker
              key={index}
              coordinate={item.coordinates}
              title={item.title}
              description={item.location}
            />
          ))}
        </MapView>
      </View>
    </ScrollView>
  );
};

export default AttractionsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#1e3a5f',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterText: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a5f',
  },
  location: {
    fontSize: 13,
    color: '#555',
  },
  description: {
    fontSize: 12,
    color: '#777',
    marginVertical: 4,
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
  heartIcon: {
    paddingLeft: 10,
   
  },
});
