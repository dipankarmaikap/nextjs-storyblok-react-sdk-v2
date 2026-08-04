import { storyblokEditable } from "@storyblok/react/next";
import { StoryblokBlocks } from "../lib/storyblok";
import { Block } from "@/app/schema/schema";

type GridProps = { block: Block<"grid"> };

export default function Grid({ block }: GridProps) {
  if (!block.columns || block.columns.length === 0) {
    return null;
  }

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      {...storyblokEditable(block)}
    >
      <StoryblokBlocks blocks={block.columns} />
    </section>
  );
}
