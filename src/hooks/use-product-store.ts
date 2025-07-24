
"use client";

import { create } from 'zustand';
import { Product } from '@/lib/mock-data';
import { getProducts, saveProducts } from '@/lib/pantry-actions';
import { useToast } from './use-toast';

interface ProductState {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateStock: (cartItems: { id: string, quantity: number }[]) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: true,
  fetchProducts: async () => {
    set({ loading: true });
    const products = await getProducts();
    set({ products, loading: false });
  },
  addProduct: async (productData) => {
    const newProduct = { ...productData, id: `prod_${Date.now()}` };
    const currentProducts = get().products;
    const updatedProducts = [...currentProducts, newProduct];
    
    const savedData = await saveProducts(updatedProducts);
    if (savedData) {
      set({ products: savedData });
    } else {
        const { toast } = useToast.getState();
        toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: "ไม่สามารถเพิ่มสินค้าได้" });
        await get().fetchProducts(); // Refetch on error
    }
  },
  updateProduct: async (productData) => {
    const currentProducts = get().products;
    const updatedProducts = currentProducts.map(p => p.id === productData.id ? productData : p);

    const savedData = await saveProducts(updatedProducts);
    if (savedData) {
      set({ products: savedData });
    } else {
      const { toast } = useToast.getState();
      toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: "ไม่สามารถแก้ไขสินค้าได้" });
      await get().fetchProducts(); // Refetch on error
    }
  },
  deleteProduct: async (productId) => {
    const currentProducts = get().products;
    const updatedProducts = currentProducts.filter(p => p.id !== productId);

    const savedData = await saveProducts(updatedProducts);
    if (savedData) {
      set({ products: savedData });
    } else {
      const { toast } = useToast.getState();
      toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: "ไม่สามารถลบสินค้าได้" });
      await get().fetchProducts(); // Refetch on error
    }
  },
    updateStock: async (cartItems) => {
        const currentProducts = get().products;
        const updatedProducts = currentProducts.map(p => {
            const cartItem = cartItems.find(item => item.id === p.id);
            if (cartItem) {
                return { ...p, stock: p.stock - cartItem.quantity };
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
