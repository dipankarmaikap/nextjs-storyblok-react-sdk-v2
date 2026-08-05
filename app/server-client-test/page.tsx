import { Suspense } from "react";
import { StoryblokPreview } from "@storyblok/react/next/rsc";
import { renderContent } from "../lib/actions";
import { client, StoryblokComponent, isPreview } from "../lib/storyblok";
import { PreviewBanner } from "../components/PreviewBanner";

// See app/page.tsx for a full explanation of the sync-page / async-child
// pattern and the STORYBLOK_ENV env-var approach.
export default function Home() {
  const storyPromise = client.stories.get("server-client-test", {
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
