import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { collection, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import colors from '../colors';

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
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCartItems();
    });
    return unsubscribe;
  }, [navigation]);

  const removeItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'pedidos', itemId));
      fetchCartItems();
      Alert.alert('Eliminado', 'El artículo fue removido del carrito');
    } catch (error) {
      console.error('Error al eliminar el artículo: ', error);
    }
  };

  const clearCart = async () => {
    try {
      const pedidosCollection = collection(db, 'pedidos');
      const pedidosSnapshot = await getDocs(pedidosCollection);

      const deletePromises = pedidosSnapshot.docs.map((pedido) =>
        deleteDoc(doc(db, 'pedidos', pedido.id))
      );
      await Promise.all(deletePromises);
      setCartItems([]);
      setTotalPrice(0);
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
      <View style={styles.itemInfo}>
        <Text style={styles.name} numberOfLines={1}>{item.nombre}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${(item.precio * (item.cantidad || 1)).toFixed(2)}</Text>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantity}>x{item.cantidad || 1}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => removeItem(item.id)}
      >
        <MaterialIcons name="delete-outline" size={24} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Carrito</Text>
        <View style={{ width: 24 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <FontAwesome name="shopping-basket" size={80} color={colors.primaryLight} />
          <Text style={styles.emptyText}>Tu carrito está vacío</Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('Menu')}
          >
            <Text style={styles.continueButtonText}>Explorar menú</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.summaryContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Envío:</Text>
              <Text style={styles.totalValue}>$0.00</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Total:</Text>
              <Text style={styles.grandTotalValue}>${totalPrice.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.payButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.payButtonText}>Proceder al pago</Text>
              <MaterialIcons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar pedido</Text>
            <Text style={styles.modalText}>¿Estás seguro que deseas completar tu compra por ${totalPrice.toFixed(2)}?</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handlePayment}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: colors.primary,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: colors.text,
    marginTop: 20,
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  quantityContainer: {
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  quantity: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    padding: 16,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});