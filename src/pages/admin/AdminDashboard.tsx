
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getStores, getOrders, Store, Order } from "@/services/dataService";

const AdminDashboard = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const storesData = await getStores();
        const ordersData = await getOrders();
        
        setStores(storesData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  // Calculate overall statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalCommission = totalRevenue * 0.1; // 10% commission
  
  return (
    <div className="caremeds-container py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">
            Platform Overview
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Stores</CardTitle>
            <CardDescription>Registered pharmacies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-caremeds-blue">
              {isLoading ? "..." : stores.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Orders</CardTitle>
            <CardDescription>Across all stores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-caremeds-green">
              {isLoading ? "..." : totalOrders}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
            <CardDescription>All orders value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-caremeds-blue">
              {isLoading ? "..." : `₹${totalRevenue.toFixed(2)}`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Commission Earned</CardTitle>
            <CardDescription>10% of total revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {isLoading ? "..." : `₹${totalCommission.toFixed(2)}`}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Registered Pharmacies</h2>
          <Link to="/admin/stores" className="text-caremeds-blue hover:underline">
            View All Stores
          </Link>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {stores.map((store) => (
              <Card key={store.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{store.name}</h3>
                    <p className="text-sm text-gray-600">{store.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {store.totalOrders} orders
                    </div>
                    <div className="text-sm text-gray-600">
                      ₹{store.totalRevenue.toFixed(2)} revenue
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      ₹{(store.totalRevenue * 0.1).toFixed(2)} commission
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Monthly Summary</h2>
          <div>
            <Button variant="outline" className="mr-2">Download CSV</Button>
            <Button variant="outline">Print Report</Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 font-semibold">Month</th>
                    <th className="py-3 px-4 font-semibold">Orders</th>
                    <th className="py-3 px-4 font-semibold">Total Revenue</th>
                    <th className="py-3 px-4 font-semibold">Commission (10%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">April 2025</td>
                    <td className="py-3 px-4">{totalOrders}</td>
                    <td className="py-3 px-4">₹{totalRevenue.toFixed(2)}</td>
                    <td className="py-3 px-4">₹{totalCommission.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">March 2025</td>
                    <td className="py-3 px-4">48</td>
                    <td className="py-3 px-4">₹5,280.75</td>
                    <td className="py-3 px-4">₹528.08</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">February 2025</td>
                    <td className="py-3 px-4">32</td>
                    <td className="py-3 px-4">₹3,655.20</td>
                    <td className="py-3 px-4">₹365.52</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
