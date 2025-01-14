import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';

export default function CarritoScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const fetchCartItems = async () => {
    try {
      const pedidosCollection = collection(db, 'pedidos');
      const pedidosSnapshot = await getDocs(pedidosCollection);
      const items = pedidosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);

      const total = items.reduce((sum, item) => {
        const precio = Number(item.precio) || 0;
        const cantidad = Number(item.cantidad) || 1;
        return sum + precio * cantidad;
      }, 0);
      setTotalPrice(total);
    } catch (error) {
      console.error('Error al obtener los pedidos: ', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const clearCart = async () => {
    try {
      const pedidosCollection = collection(db, 'pedidos');
      const pedidosSnapshot = await getDocs(pedidosCollection);

      const deletePromises = pedidosSnapshot.docs.map((pedido) =>
        deleteDoc(doc(db, 'pedidos', pedido.id))
      );
      await Promise.all(deletePromises);
      setCartItems([]); 
    } catch (error) {
      console.error('Error al eliminar los pedidos: ', error);
    }
  };

  const handlePayment = async () => {
    try {
      const walletDocRef = doc(db, 'billetera', 'hxCuKkoyr2cEtP1Hqf0h');
      const walletSnapshot = await getDoc(walletDocRef);

      if (!walletSnapshot.exists()) {
        Alert.alert('Error', 'No se encontró la billetera.');
        return;
      }

      const walletData = walletSnapshot.data();
      const currentBalance = walletData.coins;

      if (currentBalance < totalPrice) {
        Alert.alert('Saldo insuficiente', 'No tienes suficiente saldo para este pedido.');
        return;
      }

      const newBalance = currentBalance - totalPrice;

      await updateDoc(walletDocRef, { coins: newBalance });

      await clearCart();

      Alert.alert(
        'Pago exitoso',
        `Pago realizado por $${totalPrice.toFixed(2)}. Nuevo saldo: $${newBalance.toFixed(2)}`
      );

      setModalVisible(false);
      navigation.navigate('OrderProcess'); 
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      Alert.alert('Error', 'Hubo un problema al procesar el pago.');
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagen }} style={styles.image} />
      <View>
        <Text style={styles.name}>{item.nombre}</Text>
        <Text style={styles.price}>${item.precio}</Text>
        <Text style={styles.quantity}>Cantidad: {item.cantidad || 1}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Carrito</Text>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={styles.payButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.payButtonText}>Pagar</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Deseas confirmar tu compra?</Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handlePayment} 
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#FF4D4D',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#FF4D4D',
  },
  quantity: {
    fontSize: 12,
    color: '#666',
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  payButton: {
    backgroundColor: '#FF4D4D',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF4D4D',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
