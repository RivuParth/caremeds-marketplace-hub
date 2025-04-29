
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(UserRole.USER);
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await login(email, password, role);
      
      if (!success) {
        Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CareMeds</Text>
        <Text style={styles.subtitle}>Medicine Delivery</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, role === UserRole.USER && styles.activeTab]} 
          onPress={() => setRole(UserRole.USER)}
        >
          <Text style={[styles.tabText, role === UserRole.USER && styles.activeTabText]}>User</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, role === UserRole.SELLER && styles.activeTab]} 
          onPress={() => setRole(UserRole.SELLER)}
        >
          <Text style={[styles.tabText, role === UserRole.SELLER && styles.activeTabText]}>Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, role === UserRole.ADMIN && styles.activeTab]} 
          onPress={() => setRole(UserRole.ADMIN)}
        >
          <Text style={[styles.tabText, role === UserRole.ADMIN && styles.activeTabText]}>Admin</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {role === UserRole.USER ? 'User Login' : role === UserRole.SELLER ? 'Seller Login' : 'Admin Login'}
        </Text>
        <Text style={styles.cardDescription}>
          {role === UserRole.USER 
            ? 'Login to your CareMeds customer account' 
            : role === UserRole.SELLER 
              ? 'Login to your pharmacy seller account' 
              : 'Login to the CareMeds admin panel'}
        </Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        
        {role !== UserRole.ADMIN && (
          <TouchableOpacity 
            style={styles.signupContainer}
            onPress={() => navigation.navigate(role === UserRole.USER ? 'Signup' : 'RegisterStore')}
          >
            <Text style={styles.signupText}>
              {role === UserRole.USER 
                ? "Don't have an account? " 
                : "Don't have a seller account? "}
              <Text style={styles.signupLink}>
                {role === UserRole.USER ? 'Sign up' : 'Register your pharmacy'}
              </Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.demoContainer}>
        <Text style={styles.demoText}>
          Demo user: user@example.com / password{'\n'}
          Demo seller: seller@example.com / password{'\n'}
          Demo admin: admin@example.com / admin
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#3B82F6',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupContainer: {
    alignItems: 'center',
  },
  signupText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#3B82F6',
  },
  demoContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  demoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  }
});

export default LoginScreen;
