// ProductList.tsx — registered blok component
// This blok itself has no DB access, but it composes ProductRows which does

import { storyblokEditable, type SbBlokData } from "@storyblok/react/next";
import { ProductRows } from "./ProductRows";

interface ProductListProps {
  blok: SbBlokData & {
    title?: string;
    category?: string;
  };
}

export function ProductList({ blok }: ProductListProps) {
  console.log("[ProductList] Rendering blok");

  return (
    <div
      className="rounded-lg border border-zinc-600 bg-zinc-900 p-4"
      {...storyblokEditable(blok)}
    >
      {blok.title && (
        <h3 className="mb-4 text-lg font-semibold text-zinc-100">
          {blok.title}
        </h3>
      )}
      {/* ProductRows is an async server component that fetches from DB */}
      <ProductRows category={blok.category} />
    </div>
  );
}
