import { Entypo, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps'; //to show marker on map
import AttractionsScreen from '../screens/AttractionsScreen';
import EventsScreen from '../screens/EventsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RestaurantScreen from '../screens/RestaurantScreen';
import ShoppingScreen from '../screens/ShoppingScreen';

const API_KEY = 'a7289b9e30b32ad10c4c6edc5310126f';

const Stack = createStackNavigator();//creating stcknaivgt to movie btw screns  


//paramters of each screnn
type RootStackParamList = {
  Home: undefined;
  LoginScreen: undefined;
  ProfileScreen: undefined;
  Attractions: undefined;
  Restaurants: undefined;
  Shopping: undefined;
  Events: undefined;
  Favorites: undefined;
  MapScreen: { category: string; locations: any[] }; 
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type MapScreenRouteProp = RouteProp<RootStackParamList, 'MapScreen'>;

function HomeScreen({ navigation }: { navigation: HomeScreenNavigationProp }) 
{
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=${API_KEY}&units=imperial`
      );
      if (!response.ok) {
        const data = await response.json();
        console.error('Weather API error:', data.message);
        setWeather(null);
        setError(true);
        return;
      }

      const data = await response.json();
      const tempInCelsius = Math.round((data.main.temp - 32) * (5 / 9)); //data in f
      setWeather({
        temp: tempInCelsius,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      });

      setError(false);
    } catch (error: any) {
      console.error('Network or parsing error:',  error.message);
      setWeather(null);
      setError(true);
    }
  };
const getWeatherIcon = (iconCode: string) => {
const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
return <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome..!</Text>


      <View style={styles.weatherCard}>
        {weather ? getWeatherIcon(weather.icon) : <MaterialCommunityIcons name="weather-partly-cloudy" size={48} color="#ffa500" />}
        <Text style={styles.temp}>{weather ? `${weather.temp}°C` : '...'}</Text>
        <Text style={styles.desc}>{weather ? weather.description : 'Loading...'}</Text>
        {error && <Text style={{ color: 'red', marginTop: 10 }}>Failed to load weather!</Text>}
      </View>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Attractions')}>
          <FontAwesome5 name="landmark" size={24} color="#fff" />
          <Text style={styles.cardText}>Attractions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Restaurants')}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#fff" />
          <Text style={styles.cardText}>Restaurants</Text>
        </TouchableOpacity>
      
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Shopping')}>
          <Entypo name="shopping-bag" size={24} color="#fff" />
          <Text style={styles.cardText}>Shopping</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Events')}>
          <FontAwesome5 name="calendar-alt" size={24} color="#fff" />
          <Text style={styles.cardText}>Events</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


function MapScreen({ route }: { route: MapScreenRouteProp }) {
  const { category, locations } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: locations[0].latitude,//detm lattitud
          longitude: locations[0].longitude,
          latitudeDelta: 0.0922,//zoom lvl in n-s dirct
          longitudeDelta: 0.0421,//zoom lvl in e-w dirct
        }}
      >
        {
           locations.map((location: any, index: number) => (
        <Marker
      key={index}//uses uniq key fr
        coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
            }}
        title={location.name}
        description={location.description}
        />

        ))}
      </MapView>
    </View>
  );
}

export default function  App() {
  return (
<Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen name="HomeScreen"component={HomeScreen} options={{ headerTitle: 'Home' , headerStatusBarHeight:0,headerLeft:() => null}}/>
      <Stack.Screen name="LoginScreen"component={LoginScreen}  options={{ headerShown: false }} />
      <Stack.Screen name="ProfileScreen"component={ProfileScreen} options={{ headerTitle: 'Profile',headerStatusBarHeight:0 }} />
      <Stack.Screen name="Attractions"component={AttractionsScreen}  options={{ headerStatusBarHeight:0 }}/>
      <Stack.Screen name="Restaurants"component={RestaurantScreen} options={{ headerStatusBarHeight:0 }}/>
      <Stack.Screen name="Shopping"component={ShoppingScreen} options={{ headerStatusBarHeight:0 }}/>
      <Stack.Screen name="Events" component={EventsScreen} options={{ headerStatusBarHeight:0 }} />
      <Stack.Screen name="Favorites"component={FavoritesScreen}options={{ headerStatusBarHeight:0 }} />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fbfd',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003366',
    fontFamily: 'Caveat_700Bold',
  },
  weatherCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 20,
  },
  weatherIcon: {
    width: 120,
    height: 60,
    marginBottom: 10,
  },
  temp: {
    fontSize: 40,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#1e3a5f',
  },
  desc: {
    fontSize: 18,
    textTransform: 'capitalize',
    color: '#666',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#1e3a5f',
    borderRadius: 15,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    marginBottom: 30,
  },
  cardText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  map: {
    width: '100%',
    height: 400,
    marginTop: 20,
  },
});
