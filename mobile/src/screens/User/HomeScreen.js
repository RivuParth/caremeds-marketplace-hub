
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';

const HomeScreen = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    fetchMedicines();
  }, []);
  
  const fetchMedicines = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/product');
      const data = response.data;
      setMedicines(data);
      setFilteredMedicines(data);
      
      // Extract unique stores and categories
      const uniqueStores = [...new Set(data.map(med => med.storeName))];
      const uniqueCategories = [...new Set(data.map(med => med.category))];
      setStores(uniqueStores);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    let result = medicines;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        med.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply store filter
    if (selectedStore !== 'all') {
      result = result.filter(med => med.storeName === selectedStore);
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(med => med.category === selectedCategory);
    }
    
    setFilteredMedicines(result);
  }, [searchTerm, selectedStore, selectedCategory, medicines]);
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStore('all');
    setSelectedCategory('all');
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse Medicines</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>
      
      <View style={styles.filtersContainer}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Pharmacy</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => {
                // Here you would open a modal or dropdown with all stores
                // For simplicity, we'll just toggle between first store and 'all'
                setSelectedStore(prevStore => 
                  prevStore === 'all' && stores.length > 0 ? stores[0] : 'all'
                );
              }}
            >
              <Text numberOfLines={1} style={styles.pickerText}>
                {selectedStore === 'all' ? 'All Pharmacies' : selectedStore}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Category</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => {
                // Here you would open a modal or dropdown with all categories
                // For simplicity, we'll just toggle between first category and 'all'
                setSelectedCategory(prevCategory => 
                  prevCategory === 'all' && categories.length > 0 ? categories[0] : 'all'
                );
              }}
            >
              <Text numberOfLines={1} style={styles.pickerText}>
                {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {(searchTerm || selectedStore !== 'all' || selectedCategory !== 'all') && (
        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading medicines...</Text>
        </View>
      ) : filteredMedicines.length > 0 ? (
        <FlatList
          data={filteredMedicines}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={item => item._id}
          numColumns={2}
          contentContainerStyle={styles.medicinesList}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="medical-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No medicines found matching your criteria.</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterItem: {
    flex: 1,
    marginRight: 8,
  },
  filterLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  pickerContainer: {
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
  medicinesList: {
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
