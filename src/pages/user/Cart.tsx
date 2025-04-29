
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCartFromLocalStorage, clearCart, OrderItem, placeOrder } from "@/services/dataService";
import { useAuth } from "@/contexts/AuthContext";

const Cart = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi">("cash");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 30 : 0;
  const total = subtotal + deliveryFee;
  
  // Group items by store
  const itemsByStore: Record<string, OrderItem[]> = {};
  
  useEffect(() => {
    // Load cart from localStorage
    const savedCart = getCartFromLocalStorage();
    setCart(savedCart);
    
    // Load user's address if logged in
    if (user) {
      setAddress("42 Consumer Street, Buyerville"); // Mock address
    }
  }, [user]);
  
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item if quantity is less than 1
      const updatedCart = cart.filter(item => item.productId !== productId);
      setCart(updatedCart);
      // Update localStorage
      localStorage.setItem("caremeds_cart", JSON.stringify(updatedCart));
      toast.info("Item removed from cart");
    } else {
      // Update quantity
      const updatedCart = cart.map(item => 
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      // Update localStorage
      localStorage.setItem("caremeds_cart", JSON.stringify(updatedCart));
    }
  };
  
  const removeItem = (productId: string) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    // Update localStorage
    localStorage.setItem("caremeds_cart", JSON.stringify(updatedCart));
    toast.info("Item removed from cart");
  };
  
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
    
    if (!address) {
      toast.error("Please enter a delivery address");
      return;
    }
    
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      // For demonstration, we're creating a simplified order
      // In reality, you'd have separate orders for each store
      
      // For demo, just place one order with the first store
      const order = {
        userId: user?.id || "user1",
        userName: user?.name || "John Doe",
        items: cart,
        total: total,
        sellerId: "store1",
        storeName: "City Pharmacy", // Mocked for demo
        paymentType: paymentMethod,
        address: address,
      };
      
      await placeOrder(order);
      
      // Clear cart and redirect
      clearCart();
      setCart([]);
      
      toast.success("Order placed successfully!");
      navigate("/user/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  return (
    <div className="caremeds-container py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add medicines to your cart to see them here.</p>
          <Button 
            onClick={() => navigate("/medicines")}
            className="bg-caremeds-blue hover:bg-blue-600"
          >
            Browse Medicines
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between border-b pb-4">
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border rounded-l-md border-r-0"
                          >
                            -
                          </button>
                          <span className="w-12 h-8 flex items-center justify-center border-t border-b">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border rounded-r-md border-l-0"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-sm text-gray-500">₹{item.price} each</div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-sm text-red-600 hover:underline mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 font-semibold flex justify-between">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="address" className="mb-2 block">Delivery Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="mb-4"
                  />
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Payment Method</h3>
                    <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "cash" | "upi")}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">Cash on Delivery</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi">UPI Payment</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut || cart.length === 0}
                    className="w-full bg-caremeds-green hover:bg-green-600"
                  >
                    {isCheckingOut ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
