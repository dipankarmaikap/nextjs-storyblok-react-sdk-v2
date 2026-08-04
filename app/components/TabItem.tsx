import { storyblokEditable } from "@storyblok/react/next";
import { StoryblokBlocks } from "../lib/storyblok";
import { Block } from "@/schema/schema";

type TabItemProps = { block: Block<"tab_item"> };

export function TabItem({ block }: TabItemProps) {
  return (
    <div {...storyblokEditable(block)}>
      {block.body?.length ? <StoryblokBlocks blocks={block.body} /> : null}
    </div>
  );
}
