import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const ProfileScreen = () => {
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email');
        const savedProfileImage = await AsyncStorage.getItem('profileImage');

        if (savedEmail) setEmail(savedEmail);
        if (savedProfileImage) setProfileImage(savedProfileImage);
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfileData();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>A</Text>
            </View>
          )}
          <Text style={styles.email}>{email || 'No Email Available'}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  header: {
    backgroundColor: '#1e3a5f',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImageText: {
    fontSize: 40,
    color: 'white',
  },
  email: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
    marginBottom: 10,
  },
});

export default ProfileScreen;
