
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from "@/services/dataService";
import { format } from "date-fns";

interface OrderCardProps {
  order: Order;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  showActions?: boolean;
}

// Helper function for status colors
const getStatusBadgeVariant = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "accepted":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "outForDelivery":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "delivered":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

// Helper function for status display name
const getStatusDisplayName = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "accepted":
      return "Accepted";
    case "outForDelivery":
      return "Out for Delivery";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

const OrderCard = ({ order, onStatusChange, showActions = false }: OrderCardProps) => {
  const { id, items, total, status, storeName, paymentType, createdAt } = order;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-semibold">Order #{id}</h3>
              <Badge className={getStatusBadgeVariant(status)}>
                {getStatusDisplayName(status)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Placed on {format(new Date(createdAt), "PPP")}
            </p>
            <p className="text-sm mt-1">
              Seller: <span className="font-medium">{storeName}</span>
            </p>
            <p className="text-sm">
              Payment: <span className="font-medium">{paymentType === "cash" ? "Cash on Delivery" : "UPI"}</span>
            </p>
          </div>
          
          <div className="mt-3 md:mt-0 text-right">
            <p className="font-bold text-lg">₹{total.toFixed(2)}</p>
            <p className="text-sm text-gray-600">{items.length} item{items.length > 1 ? "s" : ""}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Items:</h4>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {showActions && onStatusChange && status !== "delivered" && status !== "cancelled" && (
          <div className="flex flex-wrap gap-2 mt-4 border-t pt-4">
            {status === "pending" && (
              <>
                <Button 
                  variant="default" 
                  className="bg-caremeds-blue hover:bg-blue-600"
                  onClick={() => onStatusChange(id, "accepted")}
                >
                  Accept Order
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => onStatusChange(id, "cancelled")}
                >
                  Cancel Order
                </Button>
              </>
            )}
            
            {status === "accepted" && (
              <Button 
                variant="default"
                className="bg-caremeds-blue hover:bg-blue-600"
                onClick={() => onStatusChange(id, "outForDelivery")}
              >
                Mark as Out for Delivery
              </Button>
            )}
            
            {status === "outForDelivery" && (
              <Button 
                variant="default"
                className="bg-caremeds-green hover:bg-green-600"
                onClick={() => onStatusChange(id, "delivered")}
              >
                Mark as Delivered
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
