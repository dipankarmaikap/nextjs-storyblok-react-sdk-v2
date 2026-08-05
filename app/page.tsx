import { Suspense } from "react";
import { StoryblokPreview } from "@storyblok/react/next/rsc";
import { draftMode } from "next/headers";
import { renderContent } from "./lib/actions";
import { client, StoryblokComponent } from "./lib/storyblok";
import { DraftModeBanner } from "./components/DraftModeBanner";

/**
 * Home must be a *synchronous* component so that Next.js can establish a
 * static shell before any async work starts.
 *
 * In Next.js 16, calling `await draftMode()` (or any other runtime API) at
 * the top of an async page function opts the *entire* page out of the
 * streaming model: the framework buffers the full response until every
 * component — including WeatherWidget with its 10 s mock fetch — resolves.
 * That is why even DraftModeBanner was invisible for 10 s.
 *
 * The fix is the "push dynamic access down" pattern from the Next.js 16 docs:
 *   1. Keep the exported page function synchronous.
 *   2. Start the async work (draftMode, Storyblok fetch) without awaiting.
 *   3. Pass those Promises to an async child component.
 *   4. Wrap that child in <Suspense> so the framework has a shell to send
 *      while the Promises resolve (~few ms for the Storyblok API).
 *
 * After this change:
 *   • The Suspense fallback is sent immediately (< 1 ms).
 *   • PageContent resolves in a few ms → DraftModeBanner + WeatherWidget
 *     skeleton become visible almost instantly.
 *   • WeatherWidget resolves (10 s cold-cache) and streams in independently,
 *     because the registry wraps it in its own <Suspense> boundary.
 */
export default function Home() {
  // Start the async work, but do NOT await here.
  const draftModePromise = draftMode();
  const storyPromise = client.stories.get("home", {
    query: { version: "draft" },
  });

  return (
    <Suspense>
      <PageContent
        draftModePromise={draftModePromise}
        storyPromise={storyPromise}
      />
    </Suspense>
  );
}

async function PageContent({
  draftModePromise,
  storyPromise,
}: {
  draftModePromise: ReturnType<typeof draftMode>;
  storyPromise: ReturnType<typeof client.stories.get>;
}) {
  const { isEnabled: isDraftMode } = await draftModePromise;
  const { data } = await storyPromise;
  const story = data?.story;

  if (!story) {
    return <main>Story not found</main>;
  }

  // Build the content tree directly — do not call renderContent here.
  //
  // renderContent is a Server Action intended for client-side calls from
  // StoryblokPreview when the editor sends an updated story. Calling it here
  // and awaiting the result would have the same effect as any other named prop
  // containing async server components: the RSC serialiser would need to fully
  // await every async component in the tree (e.g. WeatherWidget, 10 s fetch)
  // before it could send any HTML, bypassing Suspense streaming entirely.
  //
  // Building the tree directly keeps it inside React's RSC streaming channel.
  // The registry's `suspense: true` entries (WeatherWidget) add their own
  // <Suspense fallback={skeleton}> boundaries, so the page sends the skeleton
  // immediately and streams the resolved content once the async work completes.
  const content = (
    <main>
      <StoryblokComponent block={story.content} />
    </main>
  );

  if (!isDraftMode) {
    return content;
  }

  return (
    <>
      <DraftModeBanner />
      {/*
       * renderContent is only invoked by StoryblokPreview when the Storyblok
       * Visual Editor fires an updated-story event. children carries the
       * initial SSR tree so the page is not blank on first load and Suspense
       * boundaries inside it (WeatherWidget skeleton, etc.) stream normally.
       */}
      <StoryblokPreview renderContent={renderContent}>
        {content}
      </StoryblokPreview>
    </>
  );
}
