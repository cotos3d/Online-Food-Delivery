import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { db } from '../firebaseConfig'; 
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import BottomTabNavigator from '../components/BottomTabNavigator';

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [dni, setDni] = useState('');
  const [info, setInfo] = useState('');
  const [imageUrl, setImageUrl] = useState(''); 
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserData = async () => {
    try {
      const docRef = doc(db, "users", "userProfile");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setAddress(data.address || '');
        setDni(data.dni || '');
        setInfo(data.info || '');
        setImageUrl(data.imageUrl || ''); 
      } else {
        console.log("No se encontró el documento");
      }
    } catch (error) {
      console.error("Error al obtener los datos: ", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "users", "userProfile"), {
        firstName,
        lastName,
        address,
        dni,
        info,
        imageUrl, 
      });

      setIsEditing(false); 
      Alert.alert('Guardado', 'Los cambios se han guardado correctamente en Firebase.');
    } catch (error) {
      console.error("Error al guardar en Firestore: ", error);
      Alert.alert('Error', 'No se pudieron guardar los cambios en Firebase.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.headerText}>Mi Perfil</Text>
        </View>

        {!isEditing ? (
          <View style={styles.profileContainer}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.profileImage} />
            ) : (
              <Text style={styles.label}>No se ha proporcionado una imagen</Text>
            )}
            <Text style={styles.label}>Nombre: {firstName}</Text>
            <Text style={styles.label}>Apellido: {lastName}</Text>
            <Text style={styles.label}>Dirección: {address}</Text>
            <Text style={styles.label}>DNI: {dni}</Text>
            <Text style={styles.label}>Información: {info}</Text>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />

            <Text style={styles.label}>Apellido</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />

            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={(text) => setAddress(text)}
            />

            <Text style={styles.label}>DNI</Text>
            <TextInput
              style={styles.input}
              value={dni}
              onChangeText={(text) => setDni(text)}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Información</Text>
            <TextInput
              style={[styles.input, styles.infoInput]}
              value={info}
              onChangeText={(text) => setInfo(text)}
              placeholder="Describe brevemente tus gustos e intereses"
              multiline
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <BottomTabNavigator navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    backgroundColor: '#FF4D4D',
    padding: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  profileContainer: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    fontSize: 16,
  },
  infoInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#FF4D4D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
  },
});
