import { Suspense } from "react";
import { StoryblokPreview } from "@storyblok/react/next/rsc";
import { renderContent } from "./lib/actions";
import { client, StoryblokComponent, isPreview } from "./lib/storyblok";
import { PreviewBanner } from "./components/PreviewBanner";

/**
 * Home is synchronous so Next.js can establish a static shell immediately.
 *
 * The Storyblok fetch is started here (without awaiting) and passed down to
 * the async PageContent child that lives inside a <Suspense> boundary. This
 * is the Next.js 16 "push dynamic access down" pattern: PageContent suspends
 * for the ~few ms the Storyblok API needs, then the rest of the page (banner,
 * all sync blocks) appears, while WeatherWidget streams in behind its own
 * registry Suspense boundary.
 *
 * Draft vs published is controlled by STORYBLOK_ENV=preview (set on the
 * preview Vercel deployment). No cookies, no draftMode(), no bypass tokens.
 */
export default function Home() {
  const storyPromise = client.stories.get("home", {
    query: { version: isPreview ? "draft" : "published" },
  });

  return (
    <Suspense>
      <PageContent storyPromise={storyPromise} />
    </Suspense>
  );
}

async function PageContent({
  storyPromise,
}: {
  storyPromise: ReturnType<typeof client.stories.get>;
}) {
  const { data } = await storyPromise;
  const story = data?.story;

  if (!story) {
    return <main>Story not found</main>;
  }

  const content = (
    <main>
      <StoryblokComponent block={story.content} />
    </main>
  );

  if (!isPreview) {
    return content;
  }

  return (
    <>
      <PreviewBanner />
      <StoryblokPreview renderContent={renderContent}>
        {content}
      </StoryblokPreview>
    </>
  );
}
