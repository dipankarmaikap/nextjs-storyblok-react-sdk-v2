import { storyblokEditable } from "@storyblok/react/next";
import { StoryblokBlocks } from "../lib/storyblok";
import { Block } from "@/app/schema/schema";

type PageProps = { block: Block<"page"> };

export default function Page({ block }: PageProps) {
  console.log("[Page] Rendering");

  if (!block.body || block.body.length === 0) {
    return null;
  }

  return (
    <section className="p-8" {...storyblokEditable(block)}>
      <StoryblokBlocks blocks={block.body} />
    </section>
  );
}
