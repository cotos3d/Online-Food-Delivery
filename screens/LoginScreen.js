import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import appFirebase from '../firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const colors = {
  background: '#E0F7FA',       // Celeste pastel
  primary: '#4FC3F7',          // Celeste más fuerte
  primaryDark: '#0288D1',
  primaryLight: '#B3E5FC',
  card: '#FFFFFF',
  border: '#81D4FA',
  text: '#333333',
  error: '#FF5252',
};

const auth = getAuth(appFirebase);

export default function Login() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const logueo = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Iniciando sesión', 'Accediendo...');
        navigation.navigate('Home');
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Error', 'Correo o contraseña incorrectos.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Bienvenido</Text>

        <TextInput
          placeholder="Correo Electrónico"
          style={styles.input}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholderTextColor="#888"
        />

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primaryDark} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={logueo}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => navigation.navigate('Registro')}
        >
          <Text style={styles.registerText}>
            ¿No tienes una cuenta? <Text style={{ color: colors.primaryDark }}>Regístrate aquí</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: colors.primaryLight,
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    color: colors.text,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    color: colors.card,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 1,
  },
  registerText: {
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});
