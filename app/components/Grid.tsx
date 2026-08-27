import { storyblokEditable } from "@storyblok/react";
import { StoryblokComponent } from "../lib/storyblok";
import { Block } from "@/schema/schema";

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
      <StoryblokComponent block={block.columns} />
    </section>
  );
}
