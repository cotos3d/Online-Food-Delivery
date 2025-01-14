import React, { useState, useEffect } from 'react';
import {View,Text,FlatList,StyleSheet,Image,TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import BottomTabNavigator from '../components/BottomTabNavigator';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation(); 
  const fetchFavorites = async () => {
    try {
      const favoritesCollection = collection(db, 'favoritos');
      const favoritesSnapshot = await getDocs(favoritesCollection);
      const items = favoritesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(items);
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
    }
  };

  const removeFromFavorites = async (favoriteId) => {
    try {
      await deleteDoc(doc(db, 'favoritos', favoriteId));
      setFavorites((prev) => prev.filter((item) => item.id !== favoriteId)); 
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const renderFavorite = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      <TouchableOpacity
        onPress={() => removeFromFavorites(item.id)}
        style={styles.favoriteButton}
      >
        <FontAwesome name="heart" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <MaterialIcons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Mis Favoritos</Text>
        <View style={styles.headerLine} />
      </View>

      <FlatList
        data={favorites}
        renderItem={renderFavorite}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <BottomTabNavigator navigation={navigation} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  backButton: {
    backgroundColor: '#FF4D4D',
    padding: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  favoriteButton: {
    marginLeft: 10,
  },
});
