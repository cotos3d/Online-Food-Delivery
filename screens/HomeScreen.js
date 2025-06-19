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
    backgroundColor: '#FFF5F5', // Fondo suave rojo claro
  },
  header: {
    backgroundColor: '#D32F2F', // Rojo fuerte
    padding: 24,
    paddingTop: 48,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#B71C1C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  address: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.9,
    letterSpacing: 1,
  },
  addressDetail: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 6,
    letterSpacing: 1,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  walletContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: '#FFEBEE',
    marginHorizontal: 18,
    borderRadius: 16,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  walletBox: {
    alignItems: 'center',
  },
  walletLabel: {
    color: '#B71C1C',
    fontSize: 13,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  walletAmount: {
    color: '#D32F2F',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rechargeButton: {
    backgroundColor: '#C62828',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
  },
  rechargeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 47, 47, 0.15)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFCDD2',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#D32F2F',
  },
  modalInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: '#FFF5F5',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FFCDD2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 6,
  },
  cancelButtonText: {
    color: '#B71C1C',
    fontSize: 15,
    fontWeight: 'bold',
  },
  carouselContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
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
    backgroundColor: '#E57373',
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
    padding: 18,
  },
  dishBox: {
    width: '48%',
    backgroundColor: '#FF8A80',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  dishText: {
    color: '#B71C1C',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 7,
    letterSpacing: 1,
  },
  restaurantCount: {
    color: '#B71C1C',
    fontSize: 13,
    opacity: 0.85,
  },
  blueBackground: {
    backgroundColor: '#FF5252',
  },
  greenBackground: {
    backgroundColor: '#D50000',
  },
});
export default HomeScreen;
