import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

const FAVORITE_MALLS_KEY = 'FAVORITE_MALLS';

const malls = [
  {
    name: 'UB City Mall',
    latitude: 12.9716,
    longitude: 77.5946,
    image:
      'https://cdn1.tripoto.com/media/filter/tst/img/2150847/SpotDocument/1641123277_1641123280435.jpg.webp',
    description: 'Luxury shopping and fine dining in the heart of the city.',
  },
  {
    name: 'Phoenix Marketcity',
    latitude: 12.9951,
    longitude: 77.6974,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0hRUvy9BCF26OFeow9waL92Ad9guZx7R8BA&s',
    description: 'Large mall with top brands, food court, and events.',
  },
  {
    name: 'Orion Mall',
    latitude: 13.0116,
    longitude: 77.5553,
    image:
      'https://d1di04ifehjy6m.cloudfront.net/media/filer_public/81/90/8190131b-3949-4d97-880a-578a8428313e/2.jpg',
    description: 'Lakefront mall with premium stores and a PVR cinema.',
  },
  {
    name: 'Garuda Mall',
    latitude: 12.9719,
    longitude: 77.6101,
    image:
      'https://img.staticmb.com/mbcontent/images/crop/uploads/2024/10/garuda-mall-bangalore-magrath-road_0_1200.jpg',
    description: 'Popular spot with a mix of retail, food, and fun.',
  },
  {
    name: 'Mantri Square Mall',
    latitude: 12.9938,
    longitude: 77.5689,
    image: 'https://www.mantrisquare.com/images/about/1.jpg',
    description: 'Massive mall with metro access and top outlets.',
  },
  {
    name: 'VR Bengaluru',
    latitude: 12.9941,
    longitude: 77.6958,
    image: 'https://www.popup72.com/Uploads/Popup/636946884012074272.png',
    description: 'Modern lifestyle center with shopping, dining & cinema.',
  },
  {
    name: 'Bangalore Central Mall',
    latitude: 12.9279,
    longitude: 77.684,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGV8NRydW_lvuS2OHcfXZXKW1Va16pdysTQg&s',
    description: 'Trendy shopping mall with popular brands.',
  },
  {
    name: 'Elements Mall',
    latitude: 13.0286,
    longitude: 77.6408,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTt3OlktX2YTWkXgf6r-Tj2OoA-Ym500jRRw&s',
    description: 'Compact mall with essentials and INOX theatre.',
  },
];

const ShoppingMallScreen = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filteredMalls, setFilteredMalls] = useState(malls);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await AsyncStorage.getItem(FAVORITE_MALLS_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    };
    loadFavorites();
  }, []);

  const saveFavorites = async (favList: number[]) => {
    setFavorites(favList);
    await AsyncStorage.setItem(FAVORITE_MALLS_KEY, JSON.stringify(favList));
  };

  const toggleFavorite = (index: number) => {
    const newFavs = favorites.includes(index)
      ? favorites.filter((i) => i !== index)
      : [...favorites, index];
    saveFavorites(newFavs);
  };

  const filterMalls = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredMalls(malls);
    } else {
      const lowercasedQuery = query.toLowerCase();
      setFilteredMalls(
        malls.filter((mall) =>
          mall.name.toLowerCase().includes(lowercasedQuery)
        )
      );
    }
  };

  const centerMapOnMall = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      const region: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Malls</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by mall name"
        value={searchQuery}
        onChangeText={filterMalls}
      />

      <ScrollView style={{ flex: 1 }}>
        {filteredMalls.map((mall, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => centerMapOnMall(mall.latitude, mall.longitude)}
          >
            <Image source={{ uri: mall.image }} style={styles.image} />
            <View style={styles.info}>
              <View style={styles.rowBetween}>
                <Text style={styles.name}>{mall.name}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(index)}>
                  <FontAwesome
                    name={favorites.includes(index) ? 'heart' : 'heart-o'}
                    size={20}
                    color={favorites.includes(index) ? 'red' : 'gray'}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.category}>Mall</Text>
              <View style={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <FontAwesome key={i} name="star" size={14} color="#f5c518" />
                ))}
              </View>
              <Text style={styles.description}>{mall.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.mapContainer}>
          <Text style={styles.mapLabel}>Map View</Text>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: 12.9716,
              longitude: 77.5946,
              latitudeDelta: 0.15,
              longitudeDelta: 0.15,
            }}
          >
            {filteredMalls.map((mall, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: mall.latitude,
                  longitude: mall.longitude,
                }}
                title={mall.name}
                description={mall.description}
              />
            ))}
          </MapView>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShoppingMallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e3a5f',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
  },
  category: {
    color: '#777',
    fontSize: 13,
  },
  stars: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  description: {
    fontSize: 13,
    color: '#333',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapContainer: {
    marginTop: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  map: {
    height: 250,
  },
});
