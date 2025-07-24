
"use client";

import { create } from 'zustand';
import { Product } from '@/lib/mock-data';
import { getProducts, saveProducts } from '@/lib/pantry-actions';

interface ProductState {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>;
  updateProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  updateStock: (cartItems: { id: string, quantity: number }[]) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: true,
  fetchProducts: async () => {
    set({ loading: true });
    try {
        const products = await getProducts();
        set({ products, loading: false });
    } catch (error) {
        console.error("Failed to fetch products:", error);
        set({ loading: false });
    }
  },
  addProduct: async (productData) => {
    const newProduct = { ...productData, id: `prod_${Date.now()}` };
    const currentProducts = get().products;
    const updatedProducts = [...currentProducts, newProduct];
    
    // Save to Pantry first
    const savedData = await saveProducts(updatedProducts);
    if (savedData) {
      // Then update the store with the confirmed data
      set({ products: savedData });
      return true;
    } else {
      // Refetch on error to ensure consistency
      await get().fetchProducts();
      return false;
    }
  },
  updateProduct: async (productData) => {
    const currentProducts = get().products;
    const updatedProducts = currentProducts.map(p => p.id === productData.id ? productData : p);

    const savedData = await saveProducts(updatedProducts);
    if (savedData) {
      set({ products: savedData });
      return true;
    } else {
      await get().fetchProducts();
      return false;
    }
  },
  deleteProduct: async (productId) => {
    const currentProducts = get().products;
    const updatedProducts = currentProducts.filter(p => p.id !== productId);

    const savedData = await saveProducts(updatedProducts);
    if (savedData) {
      set({ products: savedData });
      return true;
    } else {
      await get().fetchProducts();
      return false;
    }
  },
    updateStock: async (cartItems) => {
        const currentProducts = get().products;
        const updatedProducts = currentProducts.map(p => {
            const cartItem = cartItems.find(item => item.id === p.id);
            if (cartItem) {
                // Ensure stock doesn't go below zero
                const newStock = Math.max(0, p.stock - cartItem.quantity);
                return { ...p, stock: newStock };
            }
            return p;
        });

        const savedData = await saveProducts(updatedProducts);
        if (savedData) {
            set({ products: savedData });
        } else {
            // In case of stock update failure, it's critical to refetch to avoid inconsistency
            await get().fetchProducts();
            throw new Error("Failed to update stock.");
        }
    }
}));
