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
  Animated,
  Easing
} from 'react-native';
import appFirebase from '../firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const colors = {
  background: '#F8F9FA',       // Gris muy claro
  primary: '#4361EE',          // Azul moderno
  primaryDark: '#3A0CA3',
  primaryLight: '#4CC9F0',
  card: '#FFFFFF',
  border: '#E9ECEF',
  text: '#212529',
  error: '#FF5A5F',
  success: '#06D6A0',
};

const auth = getAuth(appFirebase);

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));
  const [cardOpacity] = useState(new Animated.Value(0));
  const [cardPosition] = useState(new Animated.Value(30));

  React.useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardPosition, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const logueo = async () => {
    animateButton();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('Home');
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Error', 'Correo o contraseña incorrectos.');
    }
  };

  const buttonScaleStyle = {
    transform: [{ scale: buttonScale }],
  };

  const cardAnimationStyle = {
    opacity: cardOpacity,
    transform: [{ translateY: cardPosition }],
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <LinearGradient
        colors={['#F8F9FA', '#E9ECEF']}
        style={styles.background}
      />

      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/logo.jpg')} 
          style={styles.logo} 
        />
        <Text style={styles.appName}>FoodExpress</Text>
      </View>

      <Animated.View style={[styles.card, cardAnimationStyle]}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
          placeholder="Correo Electrónico"
          style={styles.input}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#ADB5BD"
        />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholderTextColor="#ADB5BD"
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <Animated.View style={buttonScaleStyle}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={logueo}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Registro')}
          activeOpacity={0.6}
        >
          <Text style={styles.registerText}>
            Crear una nueva cuenta
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2023 FoodExpress</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 15,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 25,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 25,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  input: {
    height: 50,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    shadowColor: colors.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    width: 40,
    textAlign: 'center',
    color: '#ADB5BD',
    fontSize: 14,
  },
  registerButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  registerText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  footerText: {
    color: '#ADB5BD',
    fontSize: 12,
  },
});