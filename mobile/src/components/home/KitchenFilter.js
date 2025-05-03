
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const KitchenFilter = ({ selectedKitchen, kitchens, onKitchenSelect }) => {
  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterLabel}>Kitchen:</Text>
      <View style={styles.pickerContainer}>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => {
            // Toggle between first kitchen and 'all'
            onKitchenSelect(prevKitchen => 
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
  );
};

const styles = StyleSheet.create({
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
});

export default KitchenFilter;
