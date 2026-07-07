// ProductRows.tsx — plain server component, NOT a blok
// This is an implementation detail of ProductList, not registered in the registry

import { queryProducts } from "../lib/db";

interface ProductRowsProps {
  category?: string;
}

export async function ProductRows({ category }: ProductRowsProps) {
  // This is the critical part: async data fetching that MUST run on the server
  // When this component is rendered inside a client boundary, it will fail
  const products = await queryProducts(category);

  console.log(`[ProductRows] Rendered ${products.length} products (server-side)`);

  return (
    <ul className="space-y-2">
      {products.map((product) => (
        <li
          key={product.id}
          className="flex justify-between rounded border border-zinc-700 bg-zinc-800 p-3"
        >
          <span className="text-zinc-100">{product.name}</span>
          <span className="text-green-400">${product.price}</span>
        </li>
      ))}
    </ul>
  );
}
