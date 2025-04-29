
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderCard from "@/components/OrderCard";
import { getOrdersByUser, Order } from "@/services/dataService";
import { useAuth } from "@/contexts/AuthContext";

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadOrders = async () => {
      try {
        // For demo purposes, using a mock user ID
        const userId = user?.id || "user1";
        const data = await getOrdersByUser(userId);
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrders();
  }, [user?.id]);
  
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === activeTab));
    }
  }, [activeTab, orders]);
  
  return (
    <div className="caremeds-container py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="outForDelivery">On Delivery</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          {renderOrderList(filteredOrders, isLoading)}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          {renderOrderList(filteredOrders, isLoading)}
        </TabsContent>
        
        <TabsContent value="accepted" className="mt-0">
          {renderOrderList(filteredOrders, isLoading)}
        </TabsContent>
        
        <TabsContent value="outForDelivery" className="mt-0">
          {renderOrderList(filteredOrders, isLoading)}
        </TabsContent>
        
        <TabsContent value="delivered" className="mt-0">
          {renderOrderList(filteredOrders, isLoading)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const renderOrderList = (orders: Order[], isLoading: boolean) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-40 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-600">No orders found.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default UserOrders;
