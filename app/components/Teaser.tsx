"use client";

import { storyblokEditable } from "@storyblok/react/next";
import { Block } from "@/schema/schema";

type TeaserProps = { block: Block<"teaser"> };

export default function Teaser({ block }: TeaserProps) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-900 px-8 py-12 text-center"
      {...storyblokEditable(block)}
    >
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.12),transparent_70%)]" />

      <h1 className="relative text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
        {block.headline}
      </h1>
    </div>
  );
}
