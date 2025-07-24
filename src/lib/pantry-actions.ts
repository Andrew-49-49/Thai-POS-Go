
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


// In Pantry, we'll store all products in a single basket called 'Products'.
// The basket will contain an object with a 'products' key, which is an array of Product objects.
interface ProductsBasket {
    products: Product[];
}

export async function getProducts(): Promise<Product[]> {
    if (!PANTRY_ID) {
        console.warn("Pantry ID is not configured. Using empty array.");
        return [];
    }
    try {
        const response = await fetch(`${BASE_URL}/basket/Products`, {
            cache: 'no-store' // Ensure we always get the latest data
        });
        // If basket doesn't exist, Pantry API returns a 400.
        // We'll check for that and return an empty array.
        if (!response.ok && response.status === 400) {
            const errorText = await response.text();
            if (errorText.includes("does not exist")) {
                return []; // Basket not found, which is okay on first run.
            }
        }
        const data = await handleResponse<ProductsBasket>(response);
        return data?.products || [];
    } catch (error) {
        // Catch any other network errors
        console.error("Failed to fetch products from Pantry:", error);
        return [];
    }
}

export async function saveProducts(products: Product[]): Promise<Product[] | null> {
     if (!PANTRY_ID) {
        console.error("Pantry ID is not configured.");
        return null;
    }
    const response = await fetch(`${BASE_URL}/basket/Products`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products }),
    });
    const data = await handleResponse<ProductsBasket>(response);
    return data?.products || null;
}
