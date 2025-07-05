import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import BottomTabNavigator from '../components/BottomTabNavigator';
import colors from '../colors';

export default function MenuScreen() {
  const navigation = useNavigation();
  const [menuItems, setMenuItems] = useState([]);

  const fetchMenuItems = async () => {
    try {
      const menuCollection = collection(db, 'comida');
      const menuSnapshot = await getDocs(menuCollection);
      const items = menuSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(items);
    } catch (error) {
      console.error('Error al obtener los datos del menú: ', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const addToCart = async (item) => {
    try {
      const pedidosCollection = collection(db, 'pedidos');
      await addDoc(pedidosCollection, {
        nombre: item.nombre,
        precio: item.precio,
        imagen: item.imagen,
        cantidad: 1,
      });
      alert(`${item.nombre} agregado al carrito.`);
    } catch (error) {
      console.error('Error al agregar al carrito: ', error);
    }
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagen }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.nombre}</Text>
        <Text style={styles.price}>${item.precio}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <MaterialIcons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <Text style={styles.header}>Menú</Text>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Carrito')}
          >
            <View style={styles.cartIconContainer}>
              <MaterialIcons name="shopping-cart" size={28} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          data={menuItems}
          renderItem={renderMenuItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />

        <BottomTabNavigator navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cartButton: {
    zIndex: 1,
  },
  cartIconContainer: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});