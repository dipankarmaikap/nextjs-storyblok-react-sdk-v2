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
      className="rounded-lg border border-zinc-700 bg-zinc-900 p-6"
      {...storyblokEditable(block)}
    >
      <h2 className="text-xl font-semibold text-zinc-100">{block.name}</h2>
      {block.description ? (
        <StoryblokRichText document={block.description as SbRichTextDoc} />
      ) : null}
    </div>
  );
}
