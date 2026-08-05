import { StoryblokPreview } from "@storyblok/react/next/rsc";
import { draftMode } from "next/headers";
import { renderContent } from "./lib/actions";
import { client, StoryblokComponent } from "./lib/storyblok";
import { DraftModeBanner } from "./components/DraftModeBanner";

export default async function Home() {
  const { isEnabled: isDraftMode } = await draftMode();
  const { data } = await client.stories.get("home", {
    query: { version: "draft" },
  });
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
