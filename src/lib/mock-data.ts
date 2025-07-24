import { th } from "./translations";

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

export interface Sale {
  id: string;
  date: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  total: number;
}

export const products: Product[] = [];

export const lowStockProducts: Product[] = [];

export const salesData: Sale[] = [];

export const weeklySales: {day: string, sales: number}[] = [
    { day: th.monday, sales: 0 },
    { day: th.tuesday, sales: 0 },
    { day: th.wednesday, sales: 0 },
    { day: th.thursday, sales: 0 },
    { day: th.friday, sales: 0 },
    { day: th.saturday, sales: 0 },
    { day: th.sunday, sales: 0 },
];
