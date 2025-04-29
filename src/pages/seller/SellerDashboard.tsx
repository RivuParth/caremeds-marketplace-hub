
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import OrderCard from "@/components/OrderCard";
import { getOrdersBySeller, getMedicinesByStore, updateOrderStatus, Order, OrderStatus } from "@/services/dataService";

const SellerDashboard = () => {
  const { user, sellerProfile } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [stats, setStats] = useState({
    pendingOrders: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // For the demo, we're using mock data
        const sellerId = "store1"; // Normally would be user?.id
        
        // Get orders
        const orders = await getOrdersBySeller(sellerId);
        setRecentOrders(orders.slice(0, 5)); // Show only latest 5 orders
        
        // Get product count
        const products = await getMedicinesByStore(sellerId);
        setProductCount(products.length);
        
        // Calculate statistics
        const pendingOrders = orders.filter(
          order => order.status === "pending" || order.status === "accepted" || order.status === "outForDelivery"
        ).length;
        
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        
        setStats({
          pendingOrders,
          totalOrders: orders.length,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user?.id]);
  
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update the local state to reflect the change
      setRecentOrders(recentOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date() }
          : order
      ));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  
  return (
    <div className="caremeds-container py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {sellerProfile?.storeName || "Seller"}
          </p>
        </div>
        <Link to="/seller/products">
          <Button className="bg-caremeds-blue hover:bg-blue-600">
            Manage Products
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Orders</CardTitle>
            <CardDescription>Orders awaiting processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-caremeds-blue">
              {isLoading ? "..." : stats.pendingOrders}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Products</CardTitle>
            <CardDescription>Products in your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-caremeds-green">
              {isLoading ? "..." : productCount}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
            <CardDescription>Revenue from all orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-caremeds-blue">
              {isLoading ? "..." : `₹${stats.revenue.toFixed(2)}`}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link to="/seller/orders" className="text-caremeds-blue hover:underline">
            View All Orders
          </Link>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-40 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order}
                onStatusChange={handleStatusChange}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600">No recent orders found.</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Store Information</h2>
          <Button variant="outline">Edit Information</Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Store Name</h3>
                <p>{sellerProfile?.storeName || "Your Store Name"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                <p>{sellerProfile?.contact || "Your Contact Number"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p>{user?.email || "your@email.com"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p>{sellerProfile?.address || "Your Store Address"}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Store ID</h3>
                <p>store1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
