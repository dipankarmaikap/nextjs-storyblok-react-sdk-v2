"use client";

import { storyblokEditable, type SbBlokData } from "@storyblok/react/next";

interface TeaserProps {
  blok: SbBlokData & { headline: string };
}

export default function Teaser({ blok }: TeaserProps) {
  return (
    <div
      className="rounded-lg border border-zinc-700 bg-zinc-900 p-6"
      {...storyblokEditable(blok)}
    >
      <h2 className="text-xl font-semibold text-zinc-100">{blok.headline}</h2>
    </div>
  );
}
