import { storyblokEditable, type StoryblokBlockData } from "@storyblok/react";

interface FallbackBlockProps {
  block: StoryblokBlockData;
}

export default function FallbackBlock({ block }: FallbackBlockProps) {
  return (
    <div
      className="rounded-lg border border-yellow-600 bg-yellow-900/20 p-4 mb-4"
      {...storyblokEditable(block)}
    >
      <p className="text-yellow-400 text-sm font-mono">
        Unknown component: <strong>{block.component}</strong>
      </p>
      <p className="text-yellow-600 text-xs mt-1">UID: {block._uid}</p>
    </div>
  );
}
