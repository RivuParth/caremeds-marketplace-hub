
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ProductCard = ({ product, onAddToCart }) => {
  const { user } = useAuth();
  const isCustomer = user && user.role === 'user';
  
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      Alert.alert('Success', `${product.name} added to cart!`);
    }
  };
  
  // Helper function to render spice level
  const renderSpiceLevel = (level) => {
    const peppers = [];
    for (let i = 0; i < level; i++) {
      peppers.push(
        <Ionicons key={i} name="flame" size={12} color="#FF5252" style={{marginRight: 2}} />
      );
    }
    return peppers;
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: product.image || 'https://via.placeholder.com/150' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{product.category}</Text>
        </View>
        
        {product.isVegetarian && (
          <View style={[styles.badge, styles.vegBadge]}>
            <Text style={styles.badgeText}>Veg</Text>
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
        
        <View style={styles.storeContainer}>
          <Ionicons name="restaurant-outline" size={14} color="#666" />
          <Text style={styles.storeText} numberOfLines={1}>{product.storeName}</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.spiceContainer}>
            {product.isSpicy > 0 && renderSpiceLevel(product.isSpicy)}
          </View>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={12} color="#666" />
            <Text style={styles.timeText}>{product.preparationTime} min</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
          
          {isCustomer && (
            <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
              <Ionicons name="cart" size={16} color="white" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    height: 120,
    width: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
  },
  vegBadge: {
    backgroundColor: 'rgba(22, 163, 74, 0.9)',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  storeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  spiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default ProductCard;
