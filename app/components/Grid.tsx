import { StoryblokComponentProps } from "@storyblok/react";
import { StoryblokComponent } from "../lib/storyblok";
import { Block } from "@/schema/schema";

type GridProps = StoryblokComponentProps<Block<"grid">>;

export default function Grid({ block, editable }: GridProps) {
  if (!block.columns || block.columns.length === 0) {
    return null;
  }

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      {...editable}
    >
      <StoryblokComponent block={block.columns} />
    </section>
  );
}
