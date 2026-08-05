import { Suspense } from "react";
import { StoryblokPreview } from "@storyblok/react/next/rsc";
import { draftMode } from "next/headers";
import { renderContent } from "../lib/actions";
import { client, StoryblokComponent } from "../lib/storyblok";
import { DraftModeBanner } from "../components/DraftModeBanner";

// See app/page.tsx for a full explanation of the sync-page / async-child
// pattern and why it is required for streaming to work correctly.
export default function Home() {
  const draftModePromise = draftMode();
  const storyPromise = client.stories.get("server-client-test", {
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

  // Render directly as JSX — not via the server action — so Suspense boundaries
  // inside (e.g. WeatherWidget) stream immediately instead of the RSC serializer
  // fully awaiting every async component before sending any HTML.
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
      {/* renderContent is only used for live editor updates, not the initial load */}
      <StoryblokPreview renderContent={renderContent}>
        {content}
      </StoryblokPreview>
    </>
  );
}
