"use client";

import { storyblokEditable } from "@storyblok/react/next";
import { Block } from "@/app/schema/schema";

type TeaserProps = { block: Block<"teaser"> };

export default function Teaser({ block }: TeaserProps) {
  return (
    <div
      className="rounded-lg border border-zinc-700 bg-zinc-900 p-6"
      {...storyblokEditable(block)}
    >
      <h2 className="text-xl font-semibold text-zinc-100">{block.headline}</h2>
    </div>
  );
}
