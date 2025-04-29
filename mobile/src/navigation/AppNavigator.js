
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Screens
import LoginScreen from '../screens/User/LoginScreen';
import SignupScreen from '../screens/User/SignupScreen';
import HomeScreen from '../screens/User/HomeScreen';
import CartScreen from '../screens/User/CartScreen';
import MyOrdersScreen from '../screens/User/MyOrdersScreen';
import SellerDashboardScreen from '../screens/Seller/SellerDashboardScreen';
import ManageProductsScreen from '../screens/Seller/ManageProductsScreen';
import OrdersPanelScreen from '../screens/Seller/OrdersPanelScreen';
import RegisterStoreScreen from '../screens/Seller/RegisterStoreScreen';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="RegisterStore" component={RegisterStoreScreen} />
  </Stack.Navigator>
);

// User Tab Navigator
const UserTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Cart') {
          iconName = focused ? 'cart' : 'cart-outline';
        } else if (route.name === 'MyOrders') {
          iconName = focused ? 'list' : 'list-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3B82F6',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Medicines' }} />
    <Tab.Screen name="Cart" component={CartScreen} />
    <Tab.Screen name="MyOrders" component={MyOrdersScreen} options={{ title: 'My Orders' }} />
  </Tab.Navigator>
);

// Seller Tab Navigator
const SellerTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Dashboard') {
          iconName = focused ? 'stats-chart' : 'stats-chart-outline';
        } else if (route.name === 'Products') {
          iconName = focused ? 'medical' : 'medical-outline';
        } else if (route.name === 'Orders') {
          iconName = focused ? 'document-text' : 'document-text-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3B82F6',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={SellerDashboardScreen} options={{ title: 'Dashboard' }} />
    <Tab.Screen name="Products" component={ManageProductsScreen} options={{ title: 'Medicines' }} />
    <Tab.Screen name="Orders" component={OrdersPanelScreen} />
  </Tab.Navigator>
);

// Admin Navigator
const AdminNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard' }} />
  </Stack.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : user?.role === 'user' ? (
        <Stack.Screen name="UserMain" component={UserTabNavigator} />
      ) : user?.role === 'seller' ? (
        <Stack.Screen name="SellerMain" component={SellerTabNavigator} />
      ) : (
        <Stack.Screen name="AdminMain" component={AdminNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
