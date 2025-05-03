
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmptyState = ({ onRetry }) => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="restaurant-outline" size={50} color="#ccc" />
      <Text style={styles.emptyText}>No food items found matching your criteria.</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Clear filters and try again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: '#9b87f5',
    fontSize: 16,
  },
});

export default EmptyState;
