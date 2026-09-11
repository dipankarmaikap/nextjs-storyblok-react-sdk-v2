import { StoryblokComponentProps } from "@storyblok/react";
import { StoryblokComponent } from "../lib/storyblok";
import { Block } from "@/schema/schema";
import { TabsShell } from "./patterns/TabsShell";

type TabsProps = StoryblokComponentProps<Block<"tabs">>;

export function Tabs({ block, editable }: TabsProps) {
  return (
    <TabsShell block={block} editable={editable}>
      {/*
        Each tab panel is rendered on the server.
        TabsShell (Client Component) receives pre-rendered content
        and shows only the active panel — same pattern as Accordion.
      */}
      {block.body?.map((tab) => (
        <div key={tab._uid}>
          {tab.body?.length ? <StoryblokComponent block={tab.body} /> : null}
        </div>
      ))}
    </TabsShell>
  );
}
