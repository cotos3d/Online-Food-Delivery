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
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import colors from '../colors';

const HomeScreen = ({ navigation }) => {
  const [walletData, setWalletData] = useState({ coins: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [address, setAddress] = useState('Cargando ubicación…');

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

  const handleRecharge = async (amount) => {
    try {
      const newAmount = walletData.coins + amount;
      const docRef = doc(db, 'billetera', 'hxCuKkoyr2cEtP1Hqf0h');
      await updateDoc(docRef, { coins: newAmount });
      setWalletData((prev) => ({ ...prev, coins: newAmount }));
      Alert.alert('Éxito', `Se han añadido ${amount} monedas.`);
      setModalVisible(false);
    } catch (error) {
      console.error('Error al recargar monedas:', error);
    }
  };

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Permiso de ubicación denegado');
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync(coords);
      if (place) {
        const { street, name, city, region } = place;
        const formatted = (street || name)
          ? `${street || name}, ${city || region || ''}`.trim()
          : `${city || region || 'Ubicación desconocida'}`;
        setAddress(formatted);
      } else {
        setAddress('Ubicación desconocida');
      }
    } catch (err) {
      console.log('Error al obtener ubicación:', err);
      setAddress('Ubicación desconocida');
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
          <Text style={styles.address}>Tu ubicación actual</Text>
          <Text style={styles.addressDetail}>{address}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué te gustaría comer?"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.walletContainer}>
          <View style={styles.walletBox}>
            <Text style={styles.walletLabel}>Tus Monedas</Text>
            <View style={styles.walletRow}>
              <Text style={styles.walletAmount}>{walletData.coins}</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={fetchWalletData}>
                <Text style={styles.refreshButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.rechargeButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.rechargeButtonText}>Recargar</Text>
          </TouchableOpacity>
        </View>

        
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una cantidad para recargar:</Text>
            <View style={styles.optionsRow}>
              {[5, 10, 20, 50].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={styles.optionButton}
                  onPress={() => handleRecharge(amount)}
                >
                  <Text style={styles.optionButtonText}>{amount} monedas</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomTabNavigator navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#C3DAE7',
    padding: 24,
    paddingTop: 48,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: '#B0BEC5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  address: { color: '#3E4C59', fontSize: 13, opacity: 0.9, letterSpacing: 1 },
  addressDetail: { color: '#3E4C59', fontSize: 20, fontWeight: 'bold', marginVertical: 6, letterSpacing: 1 },
  searchInput: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginTop: 14, fontSize: 15, borderWidth: 1, borderColor: '#E0E0E0' },
  walletContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: '#E3F2FD',
    marginHorizontal: 18,
    borderRadius: 16,
    marginBottom: 18,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#CFD8DC',
    alignItems: 'center',
  },
  walletBox: { alignItems: 'center' },
  walletRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  walletLabel: { color: '#546E7A', fontSize: 13, marginBottom: 4, fontWeight: 'bold' },
  walletAmount: { color: '#0277BD', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  refreshButton: { backgroundColor: '#81D4FA', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, marginLeft: 2 },
  refreshButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  rechargeButton: { backgroundColor: '#81D4FA', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, elevation: 2 },
  rechargeButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', letterSpacing: 1 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(200, 230, 250, 0.3)' },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 24, width: '85%', alignItems: 'center', borderWidth: 1, borderColor: '#B0BEC5' },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 20, color: '#1976D2' },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' },
  optionButton: { backgroundColor: '#64B5F6', padding: 12, borderRadius: 10, margin: 6, flexGrow: 1, alignItems: 'center' },
  optionButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#ECEFF1', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 16, width: '100%' },
  cancelButtonText: { color: '#455A64', fontSize: 15, fontWeight: 'bold' },
  carouselContainer: { justifyContent: 'center', alignItems: 'center', marginVertical: 24, paddingHorizontal: 10 },
});

export default HomeScreen;
