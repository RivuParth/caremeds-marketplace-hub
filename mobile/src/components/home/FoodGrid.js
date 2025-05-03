
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ProductCard from '../ProductCard';

const FoodGrid = ({ foods, onAddToCart }) => {
  return (
    <FlatList
      data={foods}
      renderItem={({ item }) => <ProductCard product={item} onAddToCart={onAddToCart} />}
      keyExtractor={item => item._id}
      numColumns={2}
      contentContainerStyle={styles.foodsList}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create({
  foodsList: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default FoodGrid;
