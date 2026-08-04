import { StoryblokPreview } from "@storyblok/react/next/rsc";
import { draftMode } from "next/headers";
import { renderContent } from "../lib/actions";
import { client, StoryblokComponent } from "../lib/storyblok";
import { DraftModeBanner } from "../components/DraftModeBanner";

export default async function Home() {
  const { isEnabled: isDraftMode } = await draftMode();
  const { data } = await client.stories.get("server-client-test", {
    query: { version: "draft" },
  });
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
