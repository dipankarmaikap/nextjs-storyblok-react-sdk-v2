import type { BlockContent, StoryblokComponentProps } from "@storyblok/react";

type FallbackBlockProps = StoryblokComponentProps<BlockContent>;

export default function FallbackBlock({ block, editable }: FallbackBlockProps) {
  return (
    <div
      className="rounded-lg border border-yellow-600 bg-yellow-900/20 p-4 mb-4"
      {...editable}
    >
      <p className="text-yellow-400 text-sm font-mono">
        Unknown component: <strong>{block.component}</strong>
      </p>
      <p className="text-yellow-600 text-xs mt-1">UID: {block._uid}</p>
    </div>
  );
}
