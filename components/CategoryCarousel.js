import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const categories = [
  {
    id: '1',
    name: 'Near Me',
    icon: (color) => <MaterialIcons name="location-on" size={24} color={color} />,
  },
  {
    id: '2',
    name: 'Popular',
    icon: (color) => <MaterialIcons name="star" size={24} color={color} />,
  },
  {
    id: '3',
    name: 'Discount',
    icon: (color) => <FontAwesome name="ticket" size={24} color={color} />,
  },
  {
    id: '4',
    name: '24 Hours',
    icon: (color) => <MaterialIcons name="access-time" size={24} color={color} />,
  },
  {
    id: '5',
    name: 'Quick',
    icon: (color) => <Ionicons name="flash" size={24} color={color} />,
  },
];

const CategoryCarousel = () => {
  const navigation = useNavigation(); // Obtén el objeto de navegación

  const handlePress = (category) => {
    navigation.navigate('menu'); // Navega a la pantalla de productos
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.category}
          onPress={() => handlePress(category)}
        >
          {category.icon('#FF0000')} {/* Cambiado a color rojo */}
          <Text style={styles.text}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 30,
  },
  category: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  text: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF0000', // Cambiar el texto también a rojo si es necesario
  },
});

export default CategoryCarousel;
