import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const { width } = Dimensions.get('window');

const promoData = [
  {
    id: '1',
    title: "Today's Best Deals",
    discount: 'Off up to 75%',
    color: '#FFA500',
    image: '../assets/hambuerguesa.jpg', 
  },
  {
    id: '2',
    title: 'Weekly Best Deals',
    discount: 'Off up to 50%',
    color: '#FF4081',
    image: '../assets/pizza.jpg', 
  },
  
];

const PromoCarousel = () => {
  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: item.color }]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.discount}>{item.discount}</Text>
      <Image source={{ uri: item.image }} style={styles.image} />
    </View>
  );

  return (
    <Carousel
      data={promoData}
      renderItem={renderItem}
      sliderWidth={width}
      itemWidth={width * 0.8}
      layout={'default'}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 10,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  discount: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
});

export default PromoCarousel;
