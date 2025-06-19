import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../colors';

const MenuItem = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/pizza.jpg')}style={styles.image}/>
      <Text style={styles.title}>Nama menu</Text>
      <Text style={styles.price}>Rp34.000</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 14,
  },
});

export default MenuItem;