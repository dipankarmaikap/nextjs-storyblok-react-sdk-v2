import type { Story } from "@storyblok/react/next";
import { StoryblokComponent } from "../lib/storyblok";

type StoryContentProps = { story: Story };

/**
 * Single source of truth for how a Storyblok story is rendered on the page.
 *
 * Used in two places:
 *  1. page.tsx   – the initial server render
 *  2. actions.tsx – the `renderContent` server action called by StoryblokPreview
 *                   when the editor pushes live updates
 *
 * Put ALL layout / wrapper markup here so you never have to keep two places in sync.
 */
export function StoryContent({ story }: StoryContentProps) {
  return (
    <main>
      <StoryblokComponent block={story.content} />
    </main>
  );
}
