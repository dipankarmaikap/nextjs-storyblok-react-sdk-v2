import {
  SbBlokData,
  storyblokEditable,
  StoryblokRichText,
} from "@storyblok/react/next";
import { SbRichTextNode } from "@storyblok/richtext";
interface FeatureProps {
  blok: SbBlokData & {
    name?: string;
    description?: SbRichTextNode;
  };
}

export default function Feature({ blok }: FeatureProps) {
  return (
    <div
      className="rounded-lg border border-zinc-700 bg-zinc-900 p-6"
      {...storyblokEditable(blok)}
    >
      <h2 className="text-xl font-semibold text-zinc-100">{blok.name}</h2>
      {blok.description ? (
        <StoryblokRichText document={blok.description} />
      ) : null}
    </div>
  );
}
