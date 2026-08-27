import { storyblokEditable } from "@storyblok/react";
import { StoryblokComponent } from "../lib/storyblok";
import { Block } from "@/schema/schema";

type TabItemProps = { block: Block<"tab_item"> };

export function TabItem({ block }: TabItemProps) {
  return (
    <div {...storyblokEditable(block)}>
      {block.body?.length ? <StoryblokComponent block={block.body} /> : null}
    </div>
  );
}
