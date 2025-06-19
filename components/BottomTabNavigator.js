import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import colors from '../colors';

const BottomTabNavigator = ({ navigation }) => {
  const openLink = () => {
    const url = 'https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2024/12/02/05/20241202055110-Q0XAUZDH.json';  
    Linking.openURL(url).catch((err) => console.error("Error al abrir el enlace", err));
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Home')}>
        <MaterialIcons name="home" size={24} color={colors.primary} />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('near')}>
       <MaterialIcons name="star" size={24} color={colors.primaryDark} />
       <Text style={styles.label}>Favoritos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabCenter} onPress={() => navigation.navigate('menu')}>
        <FontAwesome name="shopping-bag" size={24} color={colors.card} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Profile')}>
        <MaterialIcons name="person" size={24} color={colors.primaryDark} />
        <Text style={styles.label}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: colors.primaryDark,
  },
  tabCenter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
});

export default BottomTabNavigator;
