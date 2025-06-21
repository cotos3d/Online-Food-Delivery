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

      {/* Modal Moderno de Recarga */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity 
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
              
              <View style={styles.modalHeader}>
                <MaterialIcons name="account-balance-wallet" size={32} color={colors.accent} />
                <Text style={styles.modalTitle}>Recargar Billetera</Text>
                <Text style={styles.modalSubtitle}>Ingresa los detalles de pago</Text>
              </View>
              
              <View style={styles.modalBody}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Cantidad a recargar</Text>
                  <View style={styles.amountInputContainer}>
                    <Text style={styles.currencySymbol}>S/</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      value={rechargeAmount}
                      onChangeText={setRechargeAmount}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Tarjeta de crédito/débito</Text>
                  <View style={styles.cardInputContainer}>
                    <MaterialIcons name="credit-card" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.modalInput, {paddingLeft: 30}]}
                      placeholder="1234 5678 9012 3456"
                      keyboardType="numeric"
                      value={cardNumber}
                      onChangeText={(text) => setCardNumber(text.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      maxLength={19}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
                
                <View style={styles.cardLogos}>
                  <MaterialIcons name="payment" size={28} color="#1a1f71" />
                  <MaterialIcons name="credit-score" size={28} color="#0165a3" />
                  <MaterialIcons name="attach-money" size={28} color="#ff5f00" />
                </View>
              </View>
              
              <TouchableOpacity 
                style={[styles.confirmButton, !(rechargeAmount && cardNumber) && styles.disabledButton]}
                onPress={handleRecharge}
                disabled={!(rechargeAmount && cardNumber)}
              >
                <Text style={styles.confirmButtonText}>Recargar S/ {rechargeAmount || '0.00'}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
  // Estilos del modal moderno
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.card,
    borderRadius: 24,
    width: '90%',
    maxWidth: 400,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  modalBody: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  cardInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  inputIcon: {
    position: 'absolute',
    left: 0,
    bottom: 12,
  },
  modalInput: {
    fontSize: 18,
    color: colors.text,
    paddingVertical: 8,
    flex: 1,
  },
  cardLogos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    opacity: 0.7,
  },
  confirmButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowColor: 'transparent',
  },
  confirmButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;