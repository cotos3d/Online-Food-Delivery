import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig'; 
import { collection, addDoc, getDocs } from 'firebase/firestore';
import BottomTabNavigator from '../components/BottomTabNavigator';

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
      const pedidosCollection = collection(db, 'pedidos'); // Colección "pedidos" en Firestore
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
      <Text style={styles.name}>{item.nombre}</Text>
      <Text style={styles.price}>${item.precio}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(item)} // Guardar en Firestore
      >
        <Text style={styles.addButtonText}>agregar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <MaterialIcons name="arrow-back" size={35} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Carrito')} 
        >
          <MaterialIcons name="shopping-cart" size={44} color="red" />
        </TouchableOpacity>
      </View>

 
      <Text style={styles.header}>Menú</Text>

      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
        numColumns={2}
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
    padding: 10,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#FF4D4D',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#FF4D4D',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
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
  cartButton: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 50, 
    width: 70, 
    height: 70, 
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute', 
    top: 10, 
    right: 10, 
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});
