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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const colors = {
  background: '#E8F6FB',
  primary: '#4FC3F7',
  primaryDark: '#039BE5',
  primaryLight: '#B3E5FC',
  card: '#FFFFFF',
  border: '#81D4FA',
  text: '#333333',
  accent: '#03A9F4',
};

const HomeScreen = ({ navigation }) => {
  const [walletData, setWalletData] = useState({ coins: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [locationName, setLocationName] = useState('Cargando ubicación...');

  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationName('Permiso denegado');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(location.coords);
      if (geocode.length > 0) {
        const { city, region } = geocode[0];
        setLocationName(`${city}, ${region}`);
      }
    } catch (error) {
      setLocationName('Ubicación desconocida');
    }
  };

  const fetchWalletData = async () => {
    try {
      const docRef = doc(db, 'billetera', 'hxCuKkoyr2cEtP1Hqf0h');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setWalletData(docSnap.data());
      }
    } catch (error) {
      console.error('Error al obtener datos de la billetera:', error);
    }
  };

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
      setModalVisible(false);
    } catch (error) {
      console.error('Error al recargar monedas:', error);
    }
  };

  useEffect(() => {
    fetchWalletData();
    fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.address}>Tu dirección actual</Text>
          <Text style={styles.addressDetail}>{locationName}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué te gustaría comer?"
            placeholderTextColor="#999"
          />
        </View>

        {/* Billetera */}
        <View style={styles.walletModern}>
          <View style={styles.walletIconSection}>
            <MaterialIcons name="account-balance-wallet" size={40} color={colors.card} />
          </View>
          <View style={styles.walletInfo}>
            <Text style={styles.walletTitle}>Saldo Disponible</Text>
            <Text style={styles.walletCoins}>{walletData.coins} monedas</Text>
            <View style={styles.walletActions}>
              <TouchableOpacity style={styles.walletBtn} onPress={fetchWalletData}>
                <Text style={styles.walletBtnText}>Actualizar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.walletBtn, { backgroundColor: colors.accent }]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.walletBtnText}>Recargar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Platos */}
        <View style={styles.dishesSection}>
          <View style={styles.dishBox}>
            <Text style={styles.dishText}>Comida Peruana</Text>
            <Text style={styles.restaurantCount}>
              Ceviche, lomo saltado, ají de gallina y más.
            </Text>
          </View>
          <View style={styles.dishBox}>
            <Text style={styles.dishText}>Postres Peruanos</Text>
            <Text style={styles.restaurantCount}>
              Suspiro limeño, mazamorra morada, arroz con leche...
            </Text>
          </View>
          <View style={styles.dishBox}>
            <Text style={styles.dishText}>Comida Rápida</Text>
            <Text style={styles.restaurantCount}>
              Anticuchos, salchipapas, hamburguesas con toque peruano.
            </Text>
          </View>
          <View style={styles.dishBox}>
            <Text style={styles.dishText}>Bebidas</Text>
            <Text style={styles.restaurantCount}>
              Chicha morada, emoliente, maracuyá y más.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal Moderno */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recargar Monedas</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Cantidad a recargar"
              keyboardType="numeric"
              value={rechargeAmount}
              onChangeText={setRechargeAmount}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Número de tarjeta"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleRecharge}>
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
        </KeyboardAvoidingView>
      </Modal>

      <BottomTabNavigator navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 24,
    paddingTop: 48,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  address: {
    color: colors.card,
    fontSize: 13,
  },
  addressDetail: {
    color: colors.card,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },
  walletModern: {
    flexDirection: 'row',
    backgroundColor: colors.primaryDark,
    marginHorizontal: 20,
    marginVertical: 18,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  walletIconSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 16,
  },
  walletInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  walletTitle: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  walletCoins: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  walletActions: {
    flexDirection: 'row',
    gap: 10,
  },
  walletBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 8,
  },
  walletBtnText: {
    color: colors.card,
    fontWeight: 'bold',
    fontSize: 14,
  },
  dishesSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 18,
  },
  dishBox: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
  },
  dishText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  restaurantCount: {
    color: colors.text,
    fontSize: 13,
    opacity: 0.85,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 18,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    fontSize: 15,
    color: colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginRight: 6,
  },
  confirmButtonText: {
    color: colors.card,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: colors.border,
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginLeft: 6,
  },
  cancelButtonText: {
    color: colors.text,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
