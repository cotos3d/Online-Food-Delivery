import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import appFirebase from '../firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import colors from '../colors';

const auth = getAuth(appFirebase);

export default function Login() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const logueo = async () => {
    setLoading(true);
    setSuccessMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setSuccessMessage('✅ Acceso concedido');
      setTimeout(() => {
        navigation.navigate('Home');
        setSuccessMessage('');
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          {/* Logo alternativo con icono de texto */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🍔</Text>
          </View>
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#A1A1A1"
              placeholder="ejemplo@correo.com"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              autoCapitalize="none"
              placeholderTextColor="#A1A1A1"
              placeholder="••••••••"
            />
          </View>

          {successMessage ? (
            <Text style={styles.successMessage}>{successMessage}</Text>
          ) : null}

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={logueo}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7D7D7D',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  button: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  successMessage: {
    color: colors.success,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 15,
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});