import { Block } from "@/schema/schema";
import {
  storyblokEditable,
  StoryblokRichText,
} from "@storyblok/react/next";
import { SbRichTextDoc } from "@storyblok/richtext";

type FeatureProps = { block: Block<"feature"> };

export default function Feature({ block }: FeatureProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-900 p-6 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-800/80"
      {...storyblokEditable(block)}
    >
      {/* Subtle gradient accent along the top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

      <h2 className="mb-3 text-lg font-semibold text-zinc-100">{block.name}</h2>

      {block.description ? (
        <div className="text-sm leading-relaxed text-zinc-400">
          <StoryblokRichText document={block.description as SbRichTextDoc} />
        </div>
      ) : null}
    </div>
  );
}
