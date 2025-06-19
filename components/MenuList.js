import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../colors';

const MenuCard = ({ item }) => {
  const [quantity, setQuantity] = useState(0);
  const [showNote, setShowNote] = useState(false);

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
    }
  };

  const toggleNote = () => {
    setShowNote(!showNote);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>Rp{item.price.toLocaleString()}</Text>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>
                Rp{item.originalPrice.toLocaleString()}
              </Text>
            )}
          </View>
          
          {!item.soldOut && (
            <View style={styles.actionContainer}>
              {quantity === 0 ? (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleIncrement}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={handleDecrement}>
                    <Text style={styles.quantityButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{quantity}</Text>
                  <TouchableOpacity onPress={handleIncrement}>
                    <Text style={styles.quantityButton}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={toggleNote} style={styles.noteButton}>
                    <Text style={styles.noteButtonText}>Note</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          
          {item.soldOut && (
            <Text style={styles.soldOut}>Menu habis terjual</Text>
          )}
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={item.image || require('../assets/placeholder.png')}
            style={styles.image}
          />
          <TouchableOpacity style={styles.favoriteButton}>
            <MaterialIcons name="favorite-border" size={24} color="#FF4B4B" />
          </TouchableOpacity>
        </View>
      </View>
      
      {item.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>Extra discount</Text>
        </View>
      )}
    </View>
  );
};

const MenuList = () => {
  const menuItems = [
    {
      id: '1',
      name: 'Nama menu nama menu',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      price: 34000,
      discount: false,
    },
    {
      id: '2',
      name: 'Nama menu nama menu',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      price: 34000,
      originalPrice: 44000,
      discount: true,
    },
    {
      id: '3',
      name: 'Nama menu nama menu',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et nisl.',
      price: 34000,
      soldOut: true,
    },
    {
      id: '4',
      name: 'Nama menu nama menu',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      price: 34000,
    },
    {
      id: '5',
      name: 'Nama menu nama menu',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      price: 34000,
      originalPrice: 44000,
      discount: true,
    },
  ];

  return (
    <FlatList
      data={menuItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MenuCard item={item} />}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.border,
    textDecorationLine: 'line-through',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
  },
  favoriteButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  actionContainer: {
    marginTop: 8,
  },
  addButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 20,
    color: colors.primary,
    paddingHorizontal: 12,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  noteButton: {
    marginLeft: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  noteButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
  soldOut: {
    color: colors.border,
    fontStyle: 'italic',
    marginTop: 8,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MenuList;