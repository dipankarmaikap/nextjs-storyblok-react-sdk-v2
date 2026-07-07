/**
 * Example: ProductList blok (Async Server Component)
 *
 * A server component that fetches data from a database.
 * This demonstrates the key benefit of the SDK architecture:
 * - This component can be nested inside a client component (like Accordion)
 * - It works because the parent pre-renders it as children
 * - The database query runs on the server, never in the browser
 */

import type { ReactNode } from "react";
import type { BlokComponentProps, SbBlok } from "../types";
import { storyblokEditable } from "@storyblok/react/next";
import { queryProducts } from "../../lib/db";

interface ProductListBlok extends SbBlok {
  component: "product_list";
  title?: string;
  category?: string;
}

export async function ProductListBlok({
  blok,
}: BlokComponentProps<ProductListBlok>): Promise<ReactNode> {
  // This runs on the server - safe to access database, secrets, etc.
  const products = await queryProducts(blok.category);

  return (
    <div
      {...storyblokEditable(blok)}
      style={{
        padding: "16px",
        background: "#f0fdf4",
        borderRadius: "8px",
        border: "1px solid #86efac",
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          color: "#166534",
          marginBottom: "8px",
          fontFamily: "monospace",
        }}
      >
        🖥️ SERVER COMPONENT (async, DB access)
      </div>

      {blok.title && (
        <h3 style={{ margin: "0 0 12px 0", color: "#166534" }}>{blok.title}</h3>
      )}

      <ul style={{ margin: 0, paddingLeft: "20px" }}>
        {products.map((product) => (
          <li key={product.id} style={{ marginBottom: "4px" }}>
            <span style={{ fontWeight: 500 }}>{product.name}</span>
            <span style={{ color: "#16a34a", marginLeft: "8px" }}>
              ${product.price}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
