
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';

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
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Foodie!</Text>
          <Text style={styles.subtitle}>What would you like to eat today?</Text>
        </View>
        <TouchableOpacity style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for food..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>
      
      {/* Category Selector */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={featuredCategories}
        keyExtractor={item => item.id}
        style={styles.categoryList}
        renderItem={({item}) => (
          <TouchableOpacity 
            style={[
              styles.categoryItem, 
              selectedCategory === item.id ? styles.selectedCategory : {}
            ]}
            onPress={() => handleCategoryPress(item.id)}
          >
            <Ionicons 
              name={item.icon} 
              size={20} 
              color={selectedCategory === item.id ? "#fff" : "#3B82F6"} 
            />
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === item.id ? styles.selectedCategoryText : {}
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      
      {/* Kitchen Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Kitchen:</Text>
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => {
              // Here you would open a modal or dropdown with all kitchens
              // For simplicity, we'll just toggle between first kitchen and 'all'
              setSelectedKitchen(prevKitchen => 
                prevKitchen === 'all' && kitchens.length > 0 ? kitchens[0] : 'all'
              );
            }}
          >
            <Text numberOfLines={1} style={styles.pickerText}>
              {selectedKitchen === 'all' ? 'All Kitchens' : selectedKitchen}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
      
      {(searchTerm || selectedKitchen !== 'all' || (selectedCategory !== 'all' && !featuredCategories.find(c => c.id === selectedCategory))) && (
        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading delicious food...</Text>
        </View>
      ) : filteredFoods.length > 0 ? (
        <FlatList
          data={filteredFoods}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={item => item._id}
          numColumns={2}
          contentContainerStyle={styles.foodsList}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="restaurant-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No food items found matching your criteria.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={clearFilters}>
            <Text style={styles.retryButtonText}>Clear filters and try again</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  avatarContainer: {
    width: 40,
    height: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
  },
  categoryList: {
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategory: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  pickerContainer: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  pickerText: {
    color: '#333',
    flex: 1,
  },
  clearButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  clearButtonText: {
    color: '#3B82F6',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  foodsList: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    padding: 12,
  },
  retryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
  },
});

export default HomeScreen;
