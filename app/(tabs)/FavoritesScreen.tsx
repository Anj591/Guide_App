import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const FAVORITE_ATTRACTIONS = 'FAVORITE_ATTRACTIONS';
const FAVORITE_RESTAURANTS = 'FAVORITE_RESTAURANTS';
const FAVORITE_MALLS = 'FAVORITE_MALLS';
const FAVORITE_EVENTS = 'FAVORITE_EVENTS';


const attractions = [
  {
    name: 'Lalbagh Botanical Garden',
    image: 'https://sceneloc8.com/wp-content/uploads/2024/03/Lalbagh-Botanical-Garden-4.png',
  },
  {
    name: 'Bangalore Palace',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAYUa7x89sYf_286w__RKM8jWQ1N7ovddebw&s',
  },
  {
    name: 'Cubbon Park',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRakqiGtIgCzCi3UMYiCNxDD-T6zW8C_ki7PQ&s',
  },
  {
    name: 'ISKCON Temple', 
    image: 'https://www.trawell.in/admin/images/upload/148027305ISKCONTemple_Main.jpg',
  },
  {
    name: 'Jawaharlal Nehru Planetarium',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxL45XJHGEZyYRR6Vc7wUjiAA_5h6tjTKk6g&s',
  },
  {
    name: 'Bannerghatta Biological Park',
    image: 'https://images.deccanherald.com/deccanherald/2024-01/36dc281c-a157-43e2-8d8d-cf8220d449ad/652213.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true',
  },
];

const restaurants = [
  {
    name: 'Grasshopper',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq9HhqxCpWauvXAIAt7ai0A_urL8cLjgbHOQ&s',
  },
  {
    name: 'Edo Japanese Restaurant and Bar  ITC Gardenia',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNNoZO6cT37G0I3HH-c5Pj914Ce7lQ-xIN6w&s',
  },
  {
    name: 'Toscano',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvc4Il0kmvQ4GN4_T4oEazCdP3UIW6mMY0pA&s',
  },
  {
    name: 'Farzi Cafe',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHfJiDBSYxcG63Yg_9jR-nBbSSP3efWSd4sA&s',
  },
  {
    name: 'Caperberry',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL6DNuKGB40JSjwPOIWAh0KWTJ8mE0VVTVJw&s',
  },
  {
    name: 'Ssaffron  Shangri-La Hotel',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhfO7jM98W_T3l_xXaT-7lLdOOOS47QxJ_Kg&s',
  },
  {
    name: 'The Fatty Bao',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi1mGTXdDCyvObSZg-3_NypuvijliWVrS0TA&s',
  },
  {
    name: 'Rim Naam  The Oberoi',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh2mbVY3cLnRYthDDMFI4syiOV7FRHP1Qjow&s',
  },
];

const malls = [
  {
    name: 'UB City Mall',
    image: 'https://cdn1.tripoto.com/media/filter/tst/img/2150847/SpotDocument/1641123277_1641123280435.jpg.webp',
  },
  {
    name: 'Phoenix Marketcity',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0hRUvy9BCF26OFeow9waL92Ad9guZx7R8BA&s',
  },
  {
    name: 'Orion Mall',
    image: 'https://d1di04ifehjy6m.cloudfront.net/media/filer_public/81/90/8190131b-3949-4d97-880a-578a8428313e/2.jpg',
  },
  {
    name: 'Garuda Mall',
    image: 'https://img.staticmb.com/mbcontent/images/crop/uploads/2024/10/garuda-mall-bangalore-magrath-road_0_1200.jpg',
  },
  {
    name: 'Mantri Square Mall',
    image: 'https://www.mantrisquare.com/images/about/1.jpg',
  },
  {
    name: 'VR Bengaluru',
    image: 'https://www.popup72.com/Uploads/Popup/636946884012074272.png',
  },
  {
    name: 'Bangalore Central Mall',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGV8NRydW_lvuS2OHcfXZXKW1Va16pdysTQg&s',
  },
  {
    name: 'Elements Mall',
    
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTt3OlktX2YTWkXgf6r-Tj2OoA-Ym500jRRw&s',
  }
];

const events = [
  {
    name: 'Music Concert',
    image: 'https://example.com/music-concert.jpg',
  },
  {
    name: 'Art Exhibition',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4pH72UwsvywInVwsNx7Eu6YswXAenrtf5Qg&s',
  },
  {
    name: 'Food Festival',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtHYtXesM9t6UZMoEhDKOa7i0snUUnbYOpKQ&s',
  },
  {
    name: 'IPL RCB Match',
    image: 'https://documents.iplt20.com//ipl/assets/images/stadium/M.Chinnaswamy-Stadium.webp',
  },
  {
    name: 'Theater Play',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlBdzvXjK7x25QTzQBzR-hcQggN_RfW77u7Q&s',
  },
  {
    name: 'Rock Concert',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkk4DO8IGYUFnXscnoUErkdxC6uBbAWWZrWg&s',
  },
  {
    name: 'Stand-up Comedy',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUPfo-zPQFkq90ODy0-XLzkiQOikUZ5hW9ng&s',
  },
  {
    name: 'Film Screening',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTKvmhY14VHFMaDnTaqWiEIzzlgMq9z22fOA&s',
  },
  {
    name: 'Tech Meetup',
    image: 'https://cdn.prod.website-files.com/6593c9a7f9ab9dc8b1763db2/65b0566852bdf30e0a96201c_tech-events-meetups-hero-image.jpg',
  },
  {
    name: 'Craft Workshop',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ48elhTnBcZQJf-Ckq5Is_1_YA-QR12dvdgw&s',
  },
];


const FavoritesScreen = () => {
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);//stor itm of type any

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const [attrIndexes, restIndexes, mallIndexes, eventIndexes] = await Promise.all([//fetch multipl ste of data
          AsyncStorage.getItem(FAVORITE_ATTRACTIONS),
          AsyncStorage.getItem(FAVORITE_RESTAURANTS),
          AsyncStorage.getItem(FAVORITE_MALLS),
          AsyncStorage.getItem(FAVORITE_EVENTS),
        ]);

        const favAttr = JSON.parse(attrIndexes || '[]').map((i: number) => attractions[i]).filter(Boolean);
        //null means stores empty arry
        const favRest = JSON.parse(restIndexes || '[]').map((i: number) => restaurants[i]).filter(Boolean);
        const favMall = JSON.parse(mallIndexes || '[]').map((i: number) => malls[i]).filter(Boolean);
        const favEvents = JSON.parse(eventIndexes || '[]').map((i: number) => events[i]).filter(Boolean);
//boolean to remov null values
        setFavoriteItems([...favAttr, ...favRest, ...favMall, ...favEvents]);
        //sprd op to combin invidual arrays to single
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorites</Text>
      <ScrollView>
        {favoriteItems.length > 0 ? (
          favoriteItems.map((item, index) => {
            if (!item || !item.image) {//if no item imag error validation
              return (
                <View key={index} style={styles.card}>
                  <Text>No image available</Text>
                  <Text style={styles.name}>{item?.name || 'Unknown'}</Text>//no nam disply unkwn
                </View>
              );
            }

            return (
              <View key={index} style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.noFavoritesText}>No favorites yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
  },
  noFavoritesText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
  },
});
