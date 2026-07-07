import type { ReactNode } from "react";
import { LivePreviewIsland } from "./live-preview-island";
import type { Story } from "./types";

/**
 * Props for StoryblokServerStory
 */
interface StoryblokServerStoryProps {
  /** The story data from Storyblok */
  story: Story;
  /**
   * Server action that renders the story.
   * Must be marked with 'use server' directive.
   *
   * @example
   * ```tsx
   * async function render(story: Story) {
   *   'use server';
   *   return <StoryblokServerComponent blok={story.content} components={components} />;
   * }
   * ```
   */
  render: (story: Story) => Promise<ReactNode>;
  /** Whether live preview is enabled (typically from ?_storyblok param) */
  livePreview: boolean;
}

/**
 * StoryblokServerStory - RSC entry point for rendering Storyblok stories.
 *
 * This is the main component for Next.js App Router pages:
 * - Renders the story once on the server using the `render` action
 * - In live preview mode, mounts a client island that re-renders on each bridge event
 * - Server components inside bloks ship zero client JS (only the island shell)
 *
 * @example
 * ```tsx
 * // app/[[...slug]]/page.tsx
 * export default async function Page({ searchParams }) {
 *   const story = await fetchStory();
 *
 *   async function render(story: Story) {
 *     'use server';
 *     return <StoryblokServerComponent blok={story.content} components={components} />;
 *   }
 *
 *   return (
 *     <StoryblokServerStory
 *       story={story}
 *       render={render}
 *       livePreview={searchParams._storyblok !== undefined}
 *     />
 *   );
 * }
 * ```
 */
export async function StoryblokServerStory({
  story,
  render,
  livePreview,
}: StoryblokServerStoryProps) {
  // Render the story on the server
  const initial = await render(story);

  // If not in live preview, just return the static content
  if (!livePreview) {
    return <>{initial}</>;
  }

  // In live preview, mount the client island that handles updates
  return <LivePreviewIsland initial={initial} render={render} />;
}
