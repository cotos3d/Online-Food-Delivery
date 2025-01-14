import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import CategoryCarousel from '../components/CategoryCarousel';

const HomeScreen = ({ navigation }) => {
  const [walletData, setWalletData] = useState({ coins: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  // Obtener datos de la billetera desde Firebase
  const fetchWalletData = async () => {
    try {
      const docRef = doc(db, 'billetera', 'hxCuKkoyr2cEtP1Hqf0h');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setWalletData(docSnap.data());
      } else {
        console.log('No se encontró el documento de billetera.');
      }
    } catch (error) {
      console.error('Error al obtener datos de la billetera:', error);
    }
  };

  // Recargar monedas
  const handleRecharge = async () => {
    if (!rechargeAmount || !cardNumber) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const newAmount = walletData.coins + parseInt(rechargeAmount, 10);
      const docRef = doc(db, 'billetera', 'hxCuKkoyr2cEtP1Hqf0h');
      await updateDoc(docRef, { coins: newAmount });
      setWalletData((prev) => ({ ...prev, coins: newAmount }));

      Alert.alert('Éxito', `Se han añadido ${rechargeAmount} monedas.`);
      setRechargeAmount('');
      setCardNumber('');
      setModalVisible(false); // Cierra el modal después de la recarga
    } catch (error) {
      console.error('Error al recargar monedas:', error);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.address}>Tu dirección actual</Text>
          <Text style={styles.addressDetail}>Ricardo Palma</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué te gustaría comer?"
            placeholderTextColor="#999"
          />
        </View>

        {/* Sección de Billetera */}
        <View style={styles.walletContainer}>
          <View style={styles.walletBox}>
            <Text style={styles.walletLabel}>Tus Monedas</Text>
            <Text style={styles.walletAmount}>{walletData.coins}</Text>
          </View>
          <TouchableOpacity
            style={styles.rechargeButton}
            onPress={() => setModalVisible(true)} // Abre el modal
          >
            <Text style={styles.rechargeButtonText}>Recargar</Text>
          </TouchableOpacity>
        </View>

        {/* Carrusel */}
        <View style={styles.carouselContainer}>
          <CategoryCarousel onCategoryPress={(category) => console.log(category.name)} />
        </View>
      </ScrollView>

      {/* Modal para Recargar Monedas */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recargar Monedas</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Cantidad a recargar"
              keyboardType="numeric"
              value={rechargeAmount}
              onChangeText={setRechargeAmount}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Número de tarjeta"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />

            {/* Botones de confirmación y cancelación */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleRecharge}
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
        </View>
      </Modal>
       <View style={styles.dishesSection}>
          <View style={styles.dishBox}>
            <Text style={styles.dishText}>Consume Pan</Text>
            <Text style={styles.restaurantCount}>Explora nuestra exquisita variedad de panes frescos y deliciosos.</Text>
          </View>
          <View style={[styles.dishBox, styles.redBackground]}>
            <Text style={styles.dishText}>Postres</Text>
            <Text style={styles.restaurantCount}>Disfruta de un mundo de sabores con nuestras opciones de comida rápida.</Text>
          </View>
          <View style={[styles.dishBox, styles.blueBackground]}>
            <Text style={styles.dishText}>Comida Rápida</Text>
            <Text style={styles.restaurantCount}>Disfruta de un mundo de sabores con nuestras opciones de comida rápida.</Text>
          </View>
          <View style={[styles.dishBox, styles.greenBackground]}>
            <Text style={styles.dishText}>Bebidas</Text>
            <Text style={styles.restaurantCount}>Refresca tu día con nuestras bebidas, siempre deliciosas y sin alcohol.</Text>
          </View>
        </View>

      <BottomTabNavigator navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: 'tomato',
    padding: 20,
    paddingTop: 40,
  },
  address: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  addressDetail: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    fontSize: 14,
  },
  walletContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  walletBox: {
    alignItems: 'center',
  },
  walletLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  walletAmount: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rechargeButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  rechargeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF5252',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  carouselContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10, 
  },
quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FF5252',
    width: '18%',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  dishesSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  dishBox: {
    width: '48%',
    backgroundColor: '#FFA726',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'center',
  },
  dishText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantCount: {
    color: '#fff',
    fontSize: 12,
  },
  blueBackground: {
    backgroundColor: '#42A5F5',
  },
  greenBackground: {
    backgroundColor: '#66BB6A',
  },
});
export default HomeScreen;
