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

export const products: Product[] = [
  { id: "p1", name: "เสื้อยืดคอตตอน", sku: "TS-001", price: 299, stock: 50, category: "เสื้อผ้า", imageUrl: "https://placehold.co/300x300" },
  { id: "p2", name: "กางเกงยีนส์", sku: "JN-001", price: 799, stock: 30, category: "เสื้อผ้า", imageUrl: "https://placehold.co/300x300" },
  { id: "p3", name: "รองเท้าผ้าใบ", sku: "SH-001", price: 1200, stock: 20, category: "รองเท้า", imageUrl: "https://placehold.co/300x300" },
  { id: "p4", name: "หมวกแก๊ป", sku: "HT-001", price: 199, stock: 100, category: "เครื่องประดับ", imageUrl: "https://placehold.co/300x300" },
  { id: "p5", name: "กระเป๋าเป้", sku: "BG-001", price: 990, stock: 15, category: "เครื่องประดับ", imageUrl: "https://placehold.co/300x300" },
  { id: "p6", name: "นาฬิกาข้อมือ", sku: "WT-001", price: 2500, stock: 8, category: "เครื่องประดับ", imageUrl: "https://placehold.co/300x300" },
  { id: "p7", name: "เดรสยาว", sku: "DR-001", price: 899, stock: 25, category: "เสื้อผ้า", imageUrl: "https://placehold.co/300x300" },
  { id: "p8", name: "แว่นตากันแดด", sku: "SG-001", price: 450, stock: 40, category: "เครื่องประดับ", imageUrl: "https://placehold.co/300x300" },
  { id: "p9", name: "รองเท้าแตะ", sku: "SH-002", price: 150, stock: 0, category: "รองเท้า", imageUrl: "https://placehold.co/300x300" },
];

export const lowStockProducts = products.filter(p => p.stock < 10);

export const salesData: Sale[] = [
    {
      id: "S001",
      date: "2023-10-26T10:30:00Z",
      items: [{ productId: "p1", name: "เสื้อยืดคอตตอน", quantity: 2, price: 299 }],
      total: 598,
    },
    {
      id: "S002",
      date: "2023-10-26T11:45:00Z",
      items: [
        { productId: "p2", name: "กางเกงยีนส์", quantity: 1, price: 799 },
        { productId: "p4", name: "หมวกแก๊ป", quantity: 1, price: 199 },
      ],
      total: 998,
    },
    {
      id: "S003",
      date: "2023-10-25T15:00:00Z",
      items: [{ productId: "p3", name: "รองเท้าผ้าใบ", quantity: 1, price: 1200 }],
      total: 1200,
    },
    {
        id: "S004",
        date: "2023-10-24T09:15:00Z",
        items: [{ productId: "p6", name: "นาฬิกาข้อมือ", quantity: 1, price: 2500 }],
        total: 2500,
    },
];

export const weeklySales = [
    { day: th.monday, sales: Math.floor(Math.random() * 5000) + 1000 },
    { day: th.tuesday, sales: Math.floor(Math.random() * 5000) + 1000 },
    { day: th.wednesday, sales: Math.floor(Math.random() * 5000) + 1000 },
    { day: th.thursday, sales: Math.floor(Math.random() * 5000) + 1000 },
    { day: th.friday, sales: Math.floor(Math.random() * 5000) + 1000 },
    { day: th.saturday, sales: Math.floor(Math.random() * 7000) + 2000 },
    { day: th.sunday, sales: Math.floor(Math.random() * 8000) + 2500 },
];
