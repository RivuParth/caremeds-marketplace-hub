
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMedicines, Medicine } from "@/services/dataService";
import MedicineCard from "@/components/MedicineCard";

const Index = () => {
  const [featuredMedicines, setFeaturedMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const medicines = await getMedicines();
        // Randomly select a few medicines to feature
        const randomMedicines = [...medicines]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setFeaturedMedicines(randomMedicines);
      } catch (error) {
        console.error("Error loading medicines:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMedicines();
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-caremeds-blue to-blue-700 text-white py-16">
        <div className="caremeds-container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Medicines Delivered From Local Pharmacies
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Order medicines online from multiple pharmacies and get them delivered to your doorstep.
            </p>
            
            <div className="bg-white p-2 rounded-lg flex mb-8">
              <Input 
                type="search"
                placeholder="Search medicines..."
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button className="bg-caremeds-green hover:bg-green-600 ml-2">
                Search
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/medicines">
                <Button size="lg" className="bg-white text-caremeds-blue hover:bg-gray-100">
                  Browse Medicines
                </Button>
              </Link>
              <Link to="/stores">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Pharmacies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Medicines */}
      <section className="py-16 bg-gray-50">
        <div className="caremeds-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Medicines</h2>
            <Link to="/medicines" className="text-caremeds-blue hover:underline">
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-72 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredMedicines.map((medicine) => (
                <MedicineCard 
                  key={medicine.id} 
                  medicine={medicine} 
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16">
        <div className="caremeds-container">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">How CareMeds Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-caremeds-lightBlue text-caremeds-blue rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Select</h3>
              <p className="text-gray-600">
                Search for medicines from multiple local pharmacies in one place.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-caremeds-lightBlue text-caremeds-blue rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
              <p className="text-gray-600">
                Add medicines to cart and choose your preferred payment method.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-caremeds-lightBlue text-caremeds-blue rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Medicine Delivered</h3>
              <p className="text-gray-600">
                Local pharmacies prepare and deliver medicines to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Seller CTA */}
      <section className="py-16 bg-caremeds-lightGreen">
        <div className="caremeds-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Own a Pharmacy?</h2>
            <p className="text-lg mb-8 text-gray-700">
              Join the CareMeds network and reach more customers in your area. Manage your inventory, receive orders, and grow your business.
            </p>
            <Link to="/seller-register">
              <Button size="lg" className="bg-caremeds-green hover:bg-green-600">
                Register Your Pharmacy
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
