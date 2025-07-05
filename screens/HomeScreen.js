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
  Dimensions
} from 'react-native';
import * as Location from 'expo-location';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [walletData, setWalletData] = useState({ coins: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [address, setAddress] = useState('Cargando ubicación...');
  const [refreshing, setRefreshing] = useState(false);

  const fetchWalletData = async () => {
    try {
      setRefreshing(true);
      const docRef = doc(db, 'billetera', 'hxCuKkoyr2cEtP1Hqf0h');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setWalletData(docSnap.data());
      } else {
        console.log('No se encontró el documento de billetera.');
      }
    } catch (error) {
      console.error('Error al obtener datos de la billetera:', error);
    } finally {
      setRefreshing(false);
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header con ubicación */}
        <LinearGradient
          colors={['#6C63FF', '#8A85FF']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={20} color="#FFF" />
            <Text style={styles.address}>Tu ubicación actual</Text>
          </View>
          <Text style={styles.addressDetail}>{address}</Text>
          
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="¿Qué te gustaría comer?"
              placeholderTextColor="#999"
            />
          </View>
        </LinearGradient>

        {/* Tarjeta de billetera */}
        <View style={styles.walletCard}>
          <LinearGradient
            colors={['#4A00E0', '#8E2DE2']}
            style={styles.walletGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.walletHeader}>
              <Text style={styles.walletLabel}>SALDO DISPONIBLE</Text>
              <TouchableOpacity onPress={fetchWalletData} disabled={refreshing}>
                <MaterialIcons 
                  name="refresh" 
                  size={24} 
                  color="#FFF" 
                  style={refreshing ? styles.refreshingIcon : null}
                />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.walletAmount}>{walletData.coins} <Text style={styles.currency}>monedas</Text></Text>
            
            <TouchableOpacity
              style={styles.rechargeButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.rechargeButtonText}>Recargar saldo</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Sección de categorías */}
        <Text style={styles.sectionTitle}>Categorías populares</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {['Hamburguesas', 'Pizza', 'Sushi', 'Ensaladas', 'Postres', 'Bebidas'].map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <MaterialIcons name="fastfood" size={24} color="#6C63FF" />
              </View>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sección de restaurantes cercanos */}
        <Text style={styles.sectionTitle}>Restaurantes cerca de ti</Text>
        <View style={styles.restaurantCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4' }} 
            style={styles.restaurantImage}
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>Burger Palace</Text>
            <View style={styles.restaurantDetails}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.restaurantRating}>4.8</Text>
              <Text style={styles.restaurantCategory}>• Hamburguesas • $$</Text>
            </View>
            <Text style={styles.restaurantDistance}>0.5 km de distancia</Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal de recarga */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Recargar monedas</Text>
            
            <View style={styles.amountOptions}>
              {[5, 10, 20, 50].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={styles.amountOption}
                  onPress={() => handleRecharge(amount)}
                >
                  <Text style={styles.amountText}>{amount}</Text>
                  <Text style={styles.amountLabel}>monedas</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.customAmountContainer}>
              <Text style={styles.orText}>O ingresa un monto</Text>
              <TextInput
                style={styles.customAmountInput}
                placeholder="Ej: 15"
                keyboardType="numeric"
                value={rechargeAmount}
                onChangeText={setRechargeAmount}
              />
              <TouchableOpacity 
                style={styles.customAmountButton}
                onPress={() => handleRecharge(Number(rechargeAmount))}
              >
                <Text style={styles.customAmountButtonText}>Recargar</Text>
              </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  header: {
    padding: 24,
    paddingTop: 48,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 30,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  address: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginLeft: 8,
  },
  addressDetail: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  walletCard: {
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 25,
  },
  walletGradient: {
    borderRadius: 16,
    padding: 20,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  walletLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '600',
  },
  walletAmount: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  currency: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  rechargeButton: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  rechargeButtonText: {
    color: '#6C63FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  refreshingIcon: {
    transform: [{ rotate: '360deg' }],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  restaurantCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
  },
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  restaurantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  restaurantRating: {
    color: '#333',
    fontWeight: '600',
    marginLeft: 5,
    marginRight: 10,
  },
  restaurantCategory: {
    color: '#666',
    fontSize: 14,
  },
  restaurantDistance: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  amountOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountOption: {
    width: width * 0.4,
    backgroundColor: '#F3F3FF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 5,
  },
  amountLabel: {
    color: '#666',
    fontSize: 14,
  },
  orText: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 15,
  },
  customAmountContainer: {
    marginBottom: 20,
  },
  customAmountInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  customAmountButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  customAmountButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default HomeScreen;