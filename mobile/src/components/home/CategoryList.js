
import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CategoryList = ({ categories, selectedCategory, onCategoryPress }) => {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={categories}
      keyExtractor={item => item.id}
      style={styles.categoryList}
      renderItem={({item}) => (
        <TouchableOpacity 
          style={[
            styles.categoryItem, 
            selectedCategory === item.id ? styles.selectedCategory : {}
          ]}
          onPress={() => onCategoryPress(item.id)}
        >
          <Ionicons 
            name={item.icon} 
            size={20} 
            color={selectedCategory === item.id ? "#fff" : "#9b87f5"} 
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
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#9b87f5',
    borderColor: '#9b87f5',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
});

export default CategoryList;
