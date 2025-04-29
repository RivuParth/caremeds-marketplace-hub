
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Medicine } from "@/services/dataService";
import { getCartFromLocalStorage, saveCartToLocalStorage } from "@/services/dataService";
import { toast } from "sonner";

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard = ({ medicine }: MedicineCardProps) => {
  const { id, name, description, price, storeName, imageUrl } = medicine;

  const addToCart = () => {
    const cart = getCartFromLocalStorage();
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.productId === id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cart[existingItemIndex] = {
        ...cart[existingItemIndex],
        quantity: cart[existingItemIndex].quantity + 1
      };
    } else {
      // Add new item if it doesn't exist
      cart.push({
        productId: id,
        name,
        price,
        quantity: 1
      });
    }
    
    saveCartToLocalStorage(cart);
    toast.success(`Added ${name} to cart`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div className="bg-gray-100 h-40 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={name}
          className="h-32 w-32 object-contain"
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <span className="font-bold text-caremeds-blue">₹{price}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{description}</p>
        <p className="text-xs text-gray-500">Sold by: {storeName}</p>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <Button 
          onClick={addToCart}
          className="w-full bg-caremeds-green hover:bg-green-600"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MedicineCard;
