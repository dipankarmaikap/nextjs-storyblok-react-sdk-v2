import { storyblokEditable, type SbBlokData } from "@storyblok/react";

interface FeatureProps {
  blok: SbBlokData & { name: string; description: string };
}

export default function Feature({ blok }: FeatureProps) {
  return (
    <div
      className="rounded-lg border border-zinc-700 bg-zinc-900 p-6"
      {...storyblokEditable(blok)}
    >
      <h2 className="text-xl font-semibold text-zinc-100">{blok.name}</h2>
      <p className="mt-2 text-zinc-400">{blok.description}</p>
    </div>
  );
}
