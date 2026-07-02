import { storyblokEditable, type SbBlokData } from "@storyblok/react/v2";
import { StoryblokBlocks } from "../lib/storyblok";

interface PageProps {
  blok: SbBlokData & { body: SbBlokData[] };
}

export default function Page({ blok }: PageProps) {
  console.log("[Page] Rendering");

  if (!blok.body || blok.body.length === 0) {
    return null;
  }

  return (
    <section className="p-8" {...storyblokEditable(blok)}>
      <StoryblokBlocks blocks={blok.body} />
    </section>
  );
}
