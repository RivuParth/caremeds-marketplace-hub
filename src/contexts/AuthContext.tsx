
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";

export type UserRole = "user" | "seller" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface SellerProfile {
  storeName: string;
  address: string;
  contact: string;
}

interface AuthContextType {
  user: User | null;
  sellerProfile: SellerProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (userData: any, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);

  // Try to load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("caremeds_user");
    const storedSellerProfile = localStorage.getItem("caremeds_seller_profile");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedSellerProfile) {
      setSellerProfile(JSON.parse(storedSellerProfile));
    }
  }, []);

  // Mock login function - would be replaced with actual API call
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // In a real app, you'd validate credentials with your backend
      if (!email || !password) {
        toast.error("Please enter both email and password");
        return false;
      }
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock users for different roles
      let mockUser: User | null = null;
      
      if (email === "user@example.com" && password === "password") {
        mockUser = {
          id: "user-1",
          name: "John Doe",
          email: "user@example.com",
          role: "user"
        };
      } else if (email === "seller@example.com" && password === "password") {
        mockUser = {
          id: "seller-1",
          name: "Jane Smith",
          email: "seller@example.com",
          role: "seller"
        };
        
        // Add seller profile data
        setSellerProfile({
          storeName: "City Pharmacy",
          address: "123 Health Street, Medical District",
          contact: "+1234567890"
        });
        
        localStorage.setItem("caremeds_seller_profile", JSON.stringify({
          storeName: "City Pharmacy",
          address: "123 Health Street, Medical District",
          contact: "+1234567890"
        }));
      } else if (email === "admin@example.com" && password === "admin") {
        mockUser = {
          id: "admin-1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin"
        };
      } else {
        toast.error("Invalid credentials");
        return false;
      }
      
      setUser(mockUser);
      
      // Store in localStorage
      if (mockUser) {
        localStorage.setItem("caremeds_user", JSON.stringify(mockUser));
        toast.success(`Welcome back, ${mockUser.name}!`);
      }
      
      return !!mockUser;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };
  
  const register = async (userData: any, role: UserRole): Promise<boolean> => {
    try {
      // In a real app, you'd send registration data to your backend
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration success
      const newUser = {
        id: `${role}-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role
      };
      
      setUser(newUser);
      localStorage.setItem("caremeds_user", JSON.stringify(newUser));
      
      // If registering as seller, save profile data
      if (role === "seller") {
        const sellerData = {
          storeName: userData.storeName,
          address: userData.address,
          contact: userData.contact
        };
        
        setSellerProfile(sellerData);
        localStorage.setItem("caremeds_seller_profile", JSON.stringify(sellerData));
      }
      
      toast.success("Registration successful!");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    setSellerProfile(null);
    localStorage.removeItem("caremeds_user");
    localStorage.removeItem("caremeds_seller_profile");
    toast.info("You have been logged out");
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        sellerProfile,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
