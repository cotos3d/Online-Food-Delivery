import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import appFirebase from '../firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const auth = getAuth(appFirebase);

export default function Registro() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const registrar = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Registro Exitoso', 'Usuario registrado correctamente');
        navigation.navigate('login'); 
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
      </View>

      <View style={styles.card}>
        <TextInput
          placeholder="Correo Electrónico"
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor="#a9a9a9"
        />

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#FF4D4D" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={registrar}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate('login')}
      >
        <Text style={{ color: '#FF4D4D', textAlign: 'center' }}>
          ¿Ya tienes una cuenta? Inicia sesión aquí
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
    borderRadius: 50,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  input: {
    height: 50,
    backgroundColor: '#F6F7FB',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    marginTop: 20,
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
