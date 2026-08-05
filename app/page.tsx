import { Suspense } from "react";
import { StoryblokPreview } from "@storyblok/react/next/rsc";
import { draftMode } from "next/headers";
import { renderContent } from "./lib/actions";
import { client, StoryblokComponent } from "./lib/storyblok";
import { DraftModeBanner } from "./components/DraftModeBanner";
import type { Story } from "@storyblok/react/next";

export default async function Home() {
  const { isEnabled: isDraftMode } = await draftMode();

  // Start the story fetch without awaiting it.
  //
  // Passing an unresolved promise into the Suspense tree lets Next.js stream
  // the page shell (DraftModeBanner, layout) immediately. StoryContent
  // suspends only for the story fetch; WeatherWidget inside it suspends
  // independently via its own boundary — they don't block each other.
  //
  // https://nextjs.org/docs/app/guides/streaming#streaming-data-to-the-client
  const storyPromise: Promise<Story | null> = client.stories
    .get("home", { query: { version: "draft" } })
    .then((r) => r.data?.story ?? null);

  // Wrap in Suspense so StoryContent can suspend on storyPromise without
  // blocking the surrounding shell from painting.
  const content = (
    <main>
      <Suspense>
        <StoryContent storyPromise={storyPromise} />
      </Suspense>
    </main>
  );

  if (!isDraftMode) {
    return content;
  }

  return (
    <>
      <DraftModeBanner />
      {/*
       * renderContent is the server action called on every editor update.
       * children is the initial streamed content — StoryblokPreview returns
       * it directly on first render so its internal Suspense boundaries
       * (WeatherWidget skeleton, etc.) still stream normally.
       *
       * On editor updates, StoryblokPreview shows the last committed content
       * as the Suspense fallback while renderContent streams its RSC response,
       * so the page is never blank and slow components (WeatherWidget) show
       * their skeleton until their data arrives.
       */}
      <StoryblokPreview renderContent={renderContent}>
        {content}
      </StoryblokPreview>
    </>
  );
}

/**
 * Async server component that awaits the story promise and renders the
 * Storyblok component tree. Lives inside a <Suspense> boundary so it
 * suspends only this subtree while the story loads, not the whole page.
 */
async function StoryContent({
  storyPromise,
}: {
  storyPromise: Promise<Story | null>;
}) {
  const story = await storyPromise;

  if (!story) {
    return <p>Story not found</p>;
  }

  return <StoryblokComponent block={story.content} />;
}
