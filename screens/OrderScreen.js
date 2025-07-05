import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../colors';

export default function OrderProcessScreen({ navigation }) {
  const [isProcessing, setIsProcessing] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false); 
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {isProcessing ? (
          <ActivityIndicator size="large" color="#FFFFFF" /> 
        ) : (
          <MaterialIcons name="check-circle" size={80} color="#FFFFFF" />
        )}
      </View>

      <Text style={styles.title}>
        {isProcessing ? 'Orden en proceso...' : 'Orden exitosa'}
      </Text>
      <Text style={styles.subtitle}>
        {isProcessing
          ? 'ESPERE UN MOMENTO!'
          : 'Tu comida llegara en 25 min.'}
      </Text>

      {!isProcessing && (
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>home</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  homeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  homeButtonText: {
    color: colors.card,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});
