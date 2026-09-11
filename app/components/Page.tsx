import { StoryblokComponentProps } from "@storyblok/react";
import { StoryblokComponent } from "../lib/storyblok";
import { Block } from "@/schema/schema";

type PageProps = StoryblokComponentProps<Block<"page">>;

export default function Page({ block, editable }: PageProps) {
  if (!block.body || block.body.length === 0) {
    return null;
  }

  return (
    <section className="p-8" {...editable}>
      <StoryblokComponent block={block.body} />
    </section>
  );
}
