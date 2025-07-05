import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import BottomTabNavigator from '../components/BottomTabNavigator';
import colors from '../colors';

const { width } = Dimensions.get('window');

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();
  const scrollY = new Animated.Value(0);

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
      Alert.alert('Eliminado', 'El restaurante se ha eliminado de favoritos');
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const renderFavorite = ({ item, index }) => {
    const inputRange = [
      -1,
      0,
      120 * index,
      120 * (index + 2)
    ];
    
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0]
    });

    return (
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.image} 
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.restaurantName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>$$</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>15-30 min</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => removeFromFavorites(item.id)}
          style={styles.favoriteButton}
          activeOpacity={0.7}
        >
          <FontAwesome name="heart" size={24} color={colors.primary} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Favoritos</Text>
        <View style={styles.headerIcon}>
          <FontAwesome name="heart" size={20} color="white" />
        </View>
      </View>

      {/* Contenido */}
      <Animated.FlatList
        data={favorites}
        renderItem={renderFavorite}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="heart-o" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No tienes favoritos aún</Text>
            <Text style={styles.emptySubtext}>Guarda tus restaurantes favoritos aquí</Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreButtonText}>Explorar restaurantes</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <BottomTabNavigator navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 80,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  favoriteButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});