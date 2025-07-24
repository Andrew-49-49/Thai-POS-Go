
'use server';

import { Product } from "./mock-data";

const PANTRY_ID = process.env.PANTRY_ID;
const BASE_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}`;

// Helper to handle fetch responses
async function handleResponse<T>(response: Response): Promise<T | null> {
    if (response.ok) {
        try {
            // Pantry returns text for empty baskets or on clear, handle that
            const text = await response.text();
            return text ? JSON.parse(text) : null;
        } catch (e) {
            return null; // Return null if JSON parsing fails (e.g., empty response)
        }
    } else {
        console.error(`Pantry API Error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(`Error details: ${errorText}`);
        return null;
    }
}


// In Pantry, we'll store all products in a single basket called 'products'.
// The basket will contain an object with a 'products' key, which is an array of Product objects.
interface ProductsBasket {
    products: Product[];
}

export async function getProducts(): Promise<Product[]> {
    if (!PANTRY_ID) {
        console.error("Pantry ID is not configured.");
        return [];
    }
    try {
        const response = await fetch(`${BASE_URL}/basket/products`, {
            cache: 'no-store' // Ensure we always get the latest data
        });
        const data = await handleResponse<ProductsBasket>(response);
        return data?.products || [];
    } catch (error) {
        // If the basket doesn't exist, Pantry returns a 400 which is caught here.
        // In this case, we just return an empty array.
        return [];
    }
}

export async function saveProducts(products: Product[]): Promise<Product[] | null> {
     if (!PANTRY_ID) {
        console.error("Pantry ID is not configured.");
        return null;
    }
    const response = await fetch(`${BASE_URL}/basket/products`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products }),
    });
    const data = await handleResponse<ProductsBasket>(response);
    return data?.products || null;
}
