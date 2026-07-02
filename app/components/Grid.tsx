import { storyblokEditable, type SbBlokData } from "@storyblok/react/v2";
import { StoryblokBlocks } from "../lib/storyblok";

interface GridProps {
  blok: SbBlokData & { columns: SbBlokData[] };
}

export default function Grid({ blok }: GridProps) {
  if (!blok.columns || blok.columns.length === 0) {
    return null;
  }

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      {...storyblokEditable(blok)}
    >
      <StoryblokBlocks blocks={blok.columns} />
    </section>
  );
}
