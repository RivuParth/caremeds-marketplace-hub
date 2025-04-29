
// Mock data service for CareMeds app

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  storeId: string;
  storeName: string;
  category: string;
  imageUrl: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  contact: string;
  email: string;
  totalOrders: number;
  totalRevenue: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "pending" | "accepted" | "outForDelivery" | "delivered" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  sellerId: string;
  storeName: string;
  paymentType: "cash" | "upi";
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock medicines data
const medicines: Medicine[] = [
  {
    id: "med1",
    name: "Paracetamol 500mg",
    description: "Pain reliever and fever reducer",
    price: 5.99,
    quantity: 100,
    storeId: "store1",
    storeName: "City Pharmacy",
    category: "Pain Relief",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "med2",
    name: "Amoxicillin 250mg",
    description: "Antibiotic for bacterial infections",
    price: 12.50,
    quantity: 30,
    storeId: "store2",
    storeName: "Health First",
    category: "Antibiotics",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "med3",
    name: "Vitamin C 1000mg",
    description: "Immune system support",
    price: 8.25,
    quantity: 60,
    storeId: "store1",
    storeName: "City Pharmacy",
    category: "Vitamins",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "med4",
    name: "Aspirin 325mg",
    description: "Pain reliever and blood thinner",
    price: 4.50,
    quantity: 100,
    storeId: "store3",
    storeName: "MediPlus",
    category: "Pain Relief",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "med5",
    name: "Loratadine 10mg",
    description: "Antihistamine for allergies",
    price: 9.99,
    quantity: 30,
    storeId: "store2",
    storeName: "Health First",
    category: "Allergy",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "med6",
    name: "Ibuprofen 200mg",
    description: "Anti-inflammatory pain reliever",
    price: 6.75,
    quantity: 50,
    storeId: "store1",
    storeName: "City Pharmacy",
    category: "Pain Relief",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "med7",
    name: "Omeprazole 20mg",
    description: "Acid reducer for heartburn",
    price: 14.25,
    quantity: 28,
    storeId: "store3",
    storeName: "MediPlus",
    category: "Digestive Health",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "med8",
    name: "Multivitamin Daily",
    description: "Essential vitamins and minerals",
    price: 11.99,
    quantity: 90,
    storeId: "store2",
    storeName: "Health First",
    category: "Vitamins",
    imageUrl: "/placeholder.svg",
  }
];

// Mock stores data
const stores: Store[] = [
  {
    id: "store1",
    name: "City Pharmacy",
    address: "123 Health Street, Medical District",
    contact: "+1234567890",
    email: "contact@citypharmacy.com",
    totalOrders: 128,
    totalRevenue: 4580.75,
  },
  {
    id: "store2",
    name: "Health First",
    address: "456 Wellness Avenue, Care Center",
    contact: "+0987654321",
    email: "info@healthfirst.com",
    totalOrders: 97,
    totalRevenue: 3245.50,
  },
  {
    id: "store3",
    name: "MediPlus",
    address: "789 Recovery Road, Healing Plaza",
    contact: "+1122334455",
    email: "support@mediplus.com",
    totalOrders: 76,
    totalRevenue: 2890.25,
  }
];

// Mock orders data
const orders: Order[] = [
  {
    id: "ord1",
    userId: "user1",
    userName: "John Doe",
    items: [
      {
        productId: "med1",
        name: "Paracetamol 500mg",
        price: 5.99,
        quantity: 2
      },
      {
        productId: "med3",
        name: "Vitamin C 1000mg",
        price: 8.25,
        quantity: 1
      }
    ],
    total: 20.23,
    status: "delivered",
    sellerId: "store1",
    storeName: "City Pharmacy",
    paymentType: "cash",
    address: "42 Consumer Street, Buyerville",
    createdAt: new Date("2025-04-20T10:30:00"),
    updatedAt: new Date("2025-04-21T14:20:00")
  },
  {
    id: "ord2",
    userId: "user1",
    userName: "John Doe",
    items: [
      {
        productId: "med5",
        name: "Loratadine 10mg",
        price: 9.99,
        quantity: 1
      }
    ],
    total: 9.99,
    status: "pending",
    sellerId: "store2",
    storeName: "Health First",
    paymentType: "upi",
    address: "42 Consumer Street, Buyerville",
    createdAt: new Date("2025-04-28T15:45:00"),
    updatedAt: new Date("2025-04-28T15:45:00")
  },
  {
    id: "ord3",
    userId: "user2",
    userName: "Jane Smith",
    items: [
      {
        productId: "med4",
        name: "Aspirin 325mg",
        price: 4.50,
        quantity: 1
      },
      {
        productId: "med7",
        name: "Omeprazole 20mg",
        price: 14.25,
        quantity: 1
      }
    ],
    total: 18.75,
    status: "accepted",
    sellerId: "store3",
    storeName: "MediPlus",
    paymentType: "cash",
    address: "123 Customer Avenue, Shoptown",
    createdAt: new Date("2025-04-27T09:15:00"),
    updatedAt: new Date("2025-04-27T10:30:00")
  }
];

// Helper functions to get data
export const getMedicines = (): Promise<Medicine[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(medicines);
    }, 500);
  });
};

export const getMedicineById = (id: string): Promise<Medicine | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(medicines.find(medicine => medicine.id === id));
    }, 300);
  });
};

export const getMedicinesByStore = (storeId: string): Promise<Medicine[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(medicines.filter(medicine => medicine.storeId === storeId));
    }, 500);
  });
};

export const getStores = (): Promise<Store[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(stores);
    }, 500);
  });
};

export const getStoreById = (id: string): Promise<Store | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(stores.find(store => store.id === id));
    }, 300);
  });
};

export const getOrders = (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(orders);
    }, 500);
  });
};

export const getOrdersByUser = (userId: string): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(orders.filter(order => order.userId === userId));
    }, 500);
  });
};

export const getOrdersBySeller = (sellerId: string): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(orders.filter(order => order.sellerId === sellerId));
    }, 500);
  });
};

export const getOrderById = (id: string): Promise<Order | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(orders.find(order => order.id === id));
    }, 300);
  });
};

// Mock function to update order status
export const updateOrderStatus = (
  orderId: string, 
  newStatus: OrderStatus
): Promise<Order | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex] = {
          ...orders[orderIndex],
          status: newStatus,
          updatedAt: new Date()
        };
        resolve(orders[orderIndex]);
      } else {
        resolve(undefined);
      }
    }, 500);
  });
};

// Mock function to add a new medicine
export const addMedicine = (medicine: Omit<Medicine, "id">): Promise<Medicine> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMedicine = {
        ...medicine,
        id: `med${medicines.length + 1}`
      };
      medicines.push(newMedicine);
      resolve(newMedicine);
    }, 500);
  });
};

// Mock function to update a medicine
export const updateMedicine = (
  id: string, 
  medicineData: Partial<Medicine>
): Promise<Medicine | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const medicineIndex = medicines.findIndex(medicine => medicine.id === id);
      if (medicineIndex !== -1) {
        medicines[medicineIndex] = {
          ...medicines[medicineIndex],
          ...medicineData
        };
        resolve(medicines[medicineIndex]);
      } else {
        resolve(undefined);
      }
    }, 500);
  });
};

// Mock function to delete a medicine
export const deleteMedicine = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = medicines.length;
      const newMedicines = medicines.filter(medicine => medicine.id !== id);
      medicines.length = 0;
      medicines.push(...newMedicines);
      resolve(initialLength !== medicines.length);
    }, 500);
  });
};

// Mock function to place an order
export const placeOrder = (orderData: Omit<Order, "id" | "createdAt" | "updatedAt" | "status">): Promise<Order> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOrder = {
        ...orderData,
        id: `ord${orders.length + 1}`,
        status: "pending" as OrderStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      orders.push(newOrder);
      resolve(newOrder);
    }, 500);
  });
};

// Export cart functions
export const saveCartToLocalStorage = (cart: OrderItem[]) => {
  localStorage.setItem('caremeds_cart', JSON.stringify(cart));
};

export const getCartFromLocalStorage = (): OrderItem[] => {
  const cart = localStorage.getItem('caremeds_cart');
  return cart ? JSON.parse(cart) : [];
};

export const clearCart = () => {
  localStorage.removeItem('caremeds_cart');
};
