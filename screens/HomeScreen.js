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
import colors from '../colors';

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
            <View style={styles.walletRow}>
              <Text style={styles.walletAmount}>{walletData.coins}</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={fetchWalletData}>
                <Text style={styles.refreshButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.rechargeButton}
            onPress={() => setModalVisible(true)} // Abre el modal
          >
            <Text style={styles.rechargeButtonText}>Recargar</Text>
          </TouchableOpacity>
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
          <Text style={styles.dishText}>Comida Peruana</Text>
          <Text style={styles.restaurantCount}>
            Descubre la riqueza de la gastronomía peruana: ceviche, lomo saltado, ají de gallina y mucho más. ¡Sabores auténticos y tradición en cada plato!
          </Text>
        </View>
        <View style={styles.dishBox}>
          <Text style={styles.dishText}>Postres Peruanos</Text>
          <Text style={styles.restaurantCount}>
            Prueba deliciosos postres como suspiro limeño, mazamorra morada y arroz con leche. Dulzura y cultura en cada bocado.
          </Text>
        </View>
        <View style={styles.dishBox}>
          <Text style={styles.dishText}>Comida Rápida Peruana</Text>
          <Text style={styles.restaurantCount}>
            Anticuchos, salchipapas y hamburguesas con un toque peruano. ¡Perfectos para disfrutar en cualquier momento!
          </Text>
        </View>
        <View style={styles.dishBox}>
          <Text style={styles.dishText}>Bebidas Típicas</Text>
          <Text style={styles.restaurantCount}>
            Refresca tu día con chicha morada, emoliente o maracuyá. Bebidas tradicionales y refrescantes, siempre deliciosas.
          </Text>
        </View>
      </View>

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
    elevation: 8,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  address: {
    color: colors.card,
    fontSize: 13,
    opacity: 0.9,
    letterSpacing: 1,
  },
  addressDetail: {
    color: colors.card,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 6,
    letterSpacing: 1,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  walletContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: colors.primaryLight,
    marginHorizontal: 18,
    borderRadius: 16,
    marginBottom: 18,
    elevation: 3,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  walletBox: {
    alignItems: 'center',
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  walletLabel: {
    color: colors.text,
    fontSize: 13,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  walletAmount: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  refreshButton: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 2,
  },
  refreshButtonText: {
    color: colors.card,
    fontSize: 13,
    fontWeight: 'bold',
  },
  rechargeButton: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
  },
  rechargeButtonText: {
    color: colors.card,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 155, 229, 0.15)',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    color: colors.primary,
  },
  modalInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: colors.background,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  confirmButtonText: {
    color: colors.card,
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: colors.border,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 6,
  },
  cancelButtonText: {
    color: colors.text,
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
    backgroundColor: colors.accent,
    width: '18%',
  },
  actionText: {
    color: colors.card,
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
    backgroundColor: colors.card, // Fondo blanco
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  dishText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 7,
    letterSpacing: 1,
  },
  restaurantCount: {
    color: colors.text,
    fontSize: 13,
    opacity: 0.85,
  },
});
export default HomeScreen;
