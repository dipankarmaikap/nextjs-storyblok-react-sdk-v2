import { StoryblokComponentProps } from "@storyblok/react";
import { StoryblokComponent } from "../lib/storyblok";
import { Block } from "@/schema/schema";

type TabItemProps = StoryblokComponentProps<Block<"tab_item">>;

export function TabItem({ block, editable }: TabItemProps) {
  return (
    <div {...editable}>
      {block.body?.length ? <StoryblokComponent block={block.body} /> : null}
    </div>
  );
}
