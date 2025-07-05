import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Easing,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import colors from '../colors';

const { width } = Dimensions.get('window');

export default function OrderProcessScreen({ navigation }) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animación de progreso
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Animación de pulso
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      setIsProcessing(false);
      scaleAnim.stopAnimation();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Contenido principal */}
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
          {isProcessing ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <View style={styles.successIcon}>
              <FontAwesome name="check-circle" size={80} color="#4BB543" />
              <View style={styles.checkmarkBackground} />
            </View>
          )}
        </Animated.View>

        <Text style={styles.title}>
          {isProcessing ? 'Preparando tu pedido' : '¡Pedido confirmado!'}
        </Text>

        <Text style={styles.subtitle}>
          {isProcessing
            ? 'Estamos cocinando con amor...'
            : 'Tu comida llegará en 25-30 minutos'}
        </Text>

        {!isProcessing && (
          <>
            <View style={styles.deliveryInfo}>
              <View style={styles.infoCard}>
                <MaterialIcons name="delivery-dining" size={24} color={colors.primary} />
                <Text style={styles.infoText}>Repartidor asignado</Text>
              </View>
              <View style={styles.infoCard}>
                <MaterialIcons name="timer" size={24} color={colors.primary} />
                <Text style={styles.infoText}>25-30 min</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Home')}
              activeOpacity={0.9}
            >
              <Text style={styles.actionButtonText}>Volver al inicio</Text>
              <MaterialIcons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Barra de progreso (solo durante procesamiento) */}
      {isProcessing && (
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  successIcon: {
    position: 'relative',
  },
  checkmarkBackground: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(75, 181, 67, 0.1)',
    zIndex: -1,
    top: -10,
    left: -10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    maxWidth: '80%',
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  progressBarContainer: {
    height: 4,
    width: '100%',
    backgroundColor: '#EEE',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});