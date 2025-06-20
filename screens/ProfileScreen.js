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
        <Text style={styles.headerText}>MI PERFIL</Text>
      </View>

      {!isEditing ? (
        <View style={styles.profileContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.profileImage} />
          ) : (
            <View style={styles.noImageBox}>
              <MaterialIcons name="person" size={80} color={colors.border} />
              <Text style={styles.noImageText}>Sin Imagen</Text>
            </View>
          )}

          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>NOMBRE</Text>
            <Text style={styles.fieldValue}>{firstName}</Text>
          </View>

          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>APELLIDO</Text>
            <Text style={styles.fieldValue}>{lastName}</Text>
          </View>

          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>DIRECCIÓN</Text>
            <Text style={styles.fieldValue}>{address}</Text>
          </View>

          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>DNI</Text>
            <Text style={styles.fieldValue}>{dni}</Text>
          </View>

          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>INFORMACIÓN</Text>
            <Text style={styles.fieldValue}>{info}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.editLabel}>NOMBRE</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

          <Text style={styles.editLabel}>APELLIDO</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

          <Text style={styles.editLabel}>DIRECCIÓN</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} />

          <Text style={styles.editLabel}>DNI</Text>
          <TextInput
            style={styles.input}
            value={dni}
            onChangeText={setDni}
            keyboardType="numeric"
          />

          <Text style={styles.editLabel}>INFORMACIÓN</Text>
          <TextInput
            style={[styles.input, styles.infoInput]}
            value={info}
            onChangeText={setInfo}
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
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1.5,
  },
  profileContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  noImageBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  noImageText: {
    color: colors.text,
    fontSize: 14,
    marginTop: 8,
  },
  fieldBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primaryDark,
    letterSpacing: 1,
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.text,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 5,
    letterSpacing: 1,
    marginTop: 10,
  },
  input: {
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    color: colors.text,
  },
  infoInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 1,
  },
});
