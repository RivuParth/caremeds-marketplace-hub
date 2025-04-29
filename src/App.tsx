
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import RootLayout from "./components/layout/RootLayout";

// Pages
import Index from "./pages/Index";
import MedicinesList from "./pages/medicines/MedicinesList";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Cart from "./pages/user/Cart";
import UserOrders from "./pages/user/UserOrders";
import SellerDashboard from "./pages/seller/SellerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Route guard component for protected routes
interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: Array<"user" | "seller" | "admin">;
}

const ProtectedRoute = ({ element, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect based on user role if accessing unauthorized area
    if (user.role === "user") {
      return <Navigate to="/" />;
    } else if (user.role === "seller") {
      return <Navigate to="/seller/dashboard" />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
  }

  return <>{element}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RootLayout />}>
      {/* Public routes */}
      <Route index element={<Index />} />
      <Route path="medicines" element={<MedicinesList />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="seller-register" element={<Signup />} />
      
      {/* User routes */}
      <Route path="cart" element={<ProtectedRoute element={<Cart />} allowedRoles={["user"]} />} />
      <Route path="user/orders" element={<ProtectedRoute element={<UserOrders />} allowedRoles={["user"]} />} />
      
      {/* Seller routes */}
      <Route path="seller/dashboard" element={<ProtectedRoute element={<SellerDashboard />} allowedRoles={["seller"]} />} />
      
      {/* Admin routes */}
      <Route path="admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
