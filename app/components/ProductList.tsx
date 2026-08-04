// ProductList.tsx — registered blok component
// This blok itself has no DB access, but it composes ProductRows which does

import { storyblokEditable } from "@storyblok/react/next";
import { ProductRows } from "./ProductRows";
import { Block } from "@/schema/schema";

type ProductListProps = { block: Block<"product_list"> };

export function ProductList({ block }: ProductListProps) {
  console.log("[ProductList] Rendering block");

  return (
    <div
      className="rounded-lg border border-zinc-600 bg-zinc-900 p-4"
      {...storyblokEditable(block)}
    >
      {block.title && (
        <h3 className="mb-4 text-lg font-semibold text-zinc-100">
          {block.title}
        </h3>
      )}
      {/* ProductRows is an async server component that fetches from DB */}
      <ProductRows category={block.category ?? undefined} />
    </div>
  );
}
