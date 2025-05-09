import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        
        headerStyle: {
          height: 40,    
          backgroundColor: 'white',
          shadowOpacity: 0,
          elevation: 0,
        },
        headerTitleStyle: {
          fontSize: 18,     
          fontWeight: '500',
        },
        tabBarStyle: {
          position: 'absolute',
          height: 50,
          paddingBottom: Platform.OS === 'android' ? 10 : 20,
          paddingTop: 0,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: '#fff',
        },

        
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
           
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="home"
              
              size={size ?? 28}
              color={focused ? 'black' : 'grey'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="FavoritesScreen"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="heart"
              size={size ?? 28}
              color={focused ? 'black' : 'grey'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="person"
              size={size ?? 28}
              color={focused ? 'black' : 'grey'} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
