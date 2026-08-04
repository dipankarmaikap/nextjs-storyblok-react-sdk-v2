import { StoryblokBlocks } from "../lib/storyblok";
import { Block } from "@/schema/schema";
import { TabsShell } from "./patterns/TabsShell";

type TabsProps = { block: Block<"tabs"> };

export function Tabs({ block }: TabsProps) {
  return (
    <TabsShell block={block}>
      {/*
        Each tab panel is rendered on the server.
        TabsShell (Client Component) receives pre-rendered content
        and shows only the active panel — same pattern as Accordion.
      */}
      {block.body?.map((tab) => (
        <div key={tab._uid}>
          {tab.body?.length ? <StoryblokBlocks blocks={tab.body} /> : null}
        </div>
      ))}
    </TabsShell>
  );
}
