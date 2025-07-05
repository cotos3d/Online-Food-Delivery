import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { db } from '../firebaseConfig'; 
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import BottomTabNavigator from '../components/BottomTabNavigator';
import colors from '../colors';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    dni: '',
    info: '',
    imageUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserData = async () => {
    try {
      const docRef = doc(db, "users", "userProfile");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    } catch (error) {
      console.error("Error al obtener los datos: ", error);
    }
  };

  useEffect(() => { fetchUserData(); }, []);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "users", "userProfile"), userData);
      setIsEditing(false);
      Alert.alert('Perfil actualizado', 'Tus cambios se guardaron correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    }
  };

  const handleChange = (name, value) => {
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Mi Perfil</Text>
          <View style={{ width: 24 }} /> {/* Spacer para alinear el título */}
        </View>

        <View style={styles.profileCard}>
          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            {userData.imageUrl ? (
              <Image source={{ uri: userData.imageUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="person" size={48} color={colors.primaryLight} />
              </View>
            )}
            {isEditing && (
              <TouchableOpacity style={styles.editPhotoButton}>
                <MaterialIcons name="edit" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>

          {!isEditing ? (
            <View style={styles.infoContainer}>
              <ProfileField label="Nombre" value={userData.firstName} />
              <ProfileField label="Apellido" value={userData.lastName} />
              <ProfileField label="Dirección" value={userData.address} />
              <ProfileField label="DNI" value={userData.dni} />
              <ProfileField label="Sobre mí" value={userData.info} multiline />
              
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.buttonText}>Editar Perfil</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <FormField 
                label="Nombre"
                value={userData.firstName}
                onChangeText={(text) => handleChange('firstName', text)}
              />
              <FormField 
                label="Apellido"
                value={userData.lastName}
                onChangeText={(text) => handleChange('lastName', text)}
              />
              <FormField 
                label="Dirección"
                value={userData.address}
                onChangeText={(text) => handleChange('address', text)}
              />
              <FormField 
                label="DNI"
                value={userData.dni}
                onChangeText={(text) => handleChange('dni', text)}
                keyboardType="numeric"
              />
              <FormField 
                label="Sobre mí"
                value={userData.info}
                onChangeText={(text) => handleChange('info', text)}
                multiline
              />
              
              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={[styles.buttonText, {color: colors.primary}]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>Guardar Cambios</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomTabNavigator navigation={navigation} />
    </View>
  );
}

// Componentes reutilizables
const ProfileField = ({ label, value, multiline = false }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue} numberOfLines={multiline ? null : 1}>
      {value || 'No especificado'}
    </Text>
  </View>
);

const FormField = ({ label, value, onChangeText, ...props }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={[styles.input, props.multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#999"
      {...props}
    />
  </View>
);

// Estilos modernizados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.primaryLight,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primaryLight,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 30,
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  infoContainer: {
    marginTop: 8,
  },
  formContainer: {
    marginTop: 8,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 16,
    color: '#343a40',
    fontWeight: '500',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  input: {
    fontSize: 16,
    color: '#343a40',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    flex: 1,
    marginRight: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});