
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MedicineCard from "@/components/MedicineCard";
import { getMedicines, Medicine } from "@/services/dataService";

const MedicinesList = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Get unique store and category lists
  const stores = [...new Set(medicines.map(med => med.storeName))];
  const categories = [...new Set(medicines.map(med => med.category))];
  
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const data = await getMedicines();
        setMedicines(data);
        setFilteredMedicines(data);
      } catch (error) {
        console.error("Error loading medicines:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMedicines();
  }, []);
  
  useEffect(() => {
    let result = medicines;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        med.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply store filter
    if (selectedStore !== "all") {
      result = result.filter(med => med.storeName === selectedStore);
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(med => med.category === selectedCategory);
    }
    
    setFilteredMedicines(result);
  }, [searchTerm, selectedStore, selectedCategory, medicines]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStoreChange = (value: string) => {
    setSelectedStore(value);
  };
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStore("all");
    setSelectedCategory("all");
  };
  
  return (
    <div className="caremeds-container py-12">
      <h1 className="text-3xl font-bold mb-8">Browse Medicines</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow">
          <Input
            type="search"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select value={selectedStore} onValueChange={handleStoreChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Pharmacies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pharmacies</SelectItem>
              {stores.map(store => (
                <SelectItem key={store} value={store}>
                  {store}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-48">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {(searchTerm || selectedStore !== "all" || selectedCategory !== "all") && (
          <button
            onClick={clearFilters}
            className="text-sm text-caremeds-blue hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-72 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredMedicines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No medicines found matching your criteria.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-caremeds-blue hover:underline"
          >
            Clear filters and try again
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicinesList;
