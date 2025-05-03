
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import HomeHeader from '../../components/home/HomeHeader';
import SearchBar from '../../components/home/SearchBar';
import CategoryList from '../../components/home/CategoryList';
import KitchenFilter from '../../components/home/KitchenFilter';
import LoadingState from '../../components/home/LoadingState';
import EmptyState from '../../components/home/EmptyState';
import FoodGrid from '../../components/home/FoodGrid';

const HomeScreen = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKitchen, setSelectedKitchen] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [kitchens, setKitchens] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Featured categories for horizontal scrolling
  const featuredCategories = [
    { id: 'all', name: 'All', icon: 'restaurant-outline' },
    { id: 'pizza', name: 'Pizza', icon: 'pizza-outline' },
    { id: 'burger', name: 'Burger', icon: 'fast-food-outline' },
    { id: 'pasta', name: 'Pasta', icon: 'restaurant-outline' },
    { id: 'chinese', name: 'Chinese', icon: 'restaurant-outline' },
    { id: 'dessert', name: 'Dessert', icon: 'ice-cream-outline' },
    { id: 'drinks', name: 'Drinks', icon: 'beer-outline' },
  ];
  
  useEffect(() => {
    fetchFoods();
  }, []);
  
  const fetchFoods = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/product');
      const data = response.data;
      setFoods(data);
      setFilteredFoods(data);
      
      // Extract unique kitchens and categories
      const uniqueKitchens = [...new Set(data.map(food => food.storeName))];
      const uniqueCategories = [...new Set(data.map(food => food.category))];
      setKitchens(uniqueKitchens);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    let result = foods;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        food.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply kitchen filter
    if (selectedKitchen !== 'all') {
      result = result.filter(food => food.storeName === selectedKitchen);
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(food => food.category === selectedCategory);
    }
    
    setFilteredFoods(result);
  }, [searchTerm, selectedKitchen, selectedCategory, foods]);
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedKitchen('all');
    setSelectedCategory('all');
  };

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  const handleAddToCart = (product) => {
    // In a complete app, this would add to cart in a cart context or state
    Alert.alert('Success', `${product.name} added to your cart!`);
  };
  
  const showFiltersActive = () => {
    return (
      searchTerm || 
      selectedKitchen !== 'all' || 
      (selectedCategory !== 'all' && !featuredCategories.find(c => c.id === selectedCategory))
    );
  };
  
  return (
    <View style={styles.container}>
      <HomeHeader />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <CategoryList 
        categories={featuredCategories} 
        selectedCategory={selectedCategory} 
        onCategoryPress={handleCategoryPress} 
      />
      
      <KitchenFilter 
        selectedKitchen={selectedKitchen} 
        kitchens={kitchens} 
        onKitchenSelect={setSelectedKitchen} 
      />
      
      {showFiltersActive() && (
        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
      
      {isLoading ? (
        <LoadingState />
      ) : filteredFoods.length > 0 ? (
        <FoodGrid foods={filteredFoods} onAddToCart={handleAddToCart} />
      ) : (
        <EmptyState onRetry={clearFilters} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  clearButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  clearButtonText: {
    color: '#9b87f5',
    fontSize: 14,
  },
});

export default HomeScreen;
