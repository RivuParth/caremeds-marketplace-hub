
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeHeader = () => {
  return (
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
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#9b87f5', // FoodMyWay primary color
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeHeader;
