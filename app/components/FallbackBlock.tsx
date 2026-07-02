import { storyblokEditable, type SbBlokData } from "@storyblok/react";

interface FallbackBlockProps {
  blok: SbBlokData;
}

export default function FallbackBlock({ blok }: FallbackBlockProps) {
  return (
    <div
      className="rounded-lg border border-yellow-600 bg-yellow-900/20 p-4 mb-4"
      {...storyblokEditable(blok)}
    >
      <p className="text-yellow-400 text-sm font-mono">
        Unknown component: <strong>{blok.component}</strong>
      </p>
      <p className="text-yellow-600 text-xs mt-1">UID: {blok._uid}</p>
    </div>
  );
}
