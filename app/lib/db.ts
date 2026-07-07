import "server-only";

// Fake database module that simulates server-only data fetching
// This uses the "server-only" package to ensure it never runs in the browser

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

const FAKE_PRODUCTS: Product[] = [
  { id: "1", name: "Laptop Pro", price: 1299, category: "electronics" },
  { id: "2", name: "Wireless Mouse", price: 49, category: "electronics" },
  { id: "3", name: "USB-C Hub", price: 79, category: "electronics" },
  { id: "4", name: "Running Shoes", price: 129, category: "sports" },
  { id: "5", name: "Yoga Mat", price: 35, category: "sports" },
  { id: "6", name: "Coffee Maker", price: 199, category: "home" },
  { id: "7", name: "Desk Lamp", price: 45, category: "home" },
];

export async function queryProducts(category?: string): Promise<Product[]> {
  // Simulate database latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Log to verify this runs on server
  console.log(
    `[DB] Querying products for category: ${category || "all"} (server-side)`
  );

  if (category) {
    return FAKE_PRODUCTS.filter((p) => p.category === category);
  }
  return FAKE_PRODUCTS;
}
