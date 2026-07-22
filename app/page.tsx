import { StoryblokPreview } from "@storyblok/react/next/rsc";
import { draftMode } from "next/headers";
import { renderContent } from "./lib/actions";
import { client } from "./lib/storyblok";

export default async function Home() {
  const { isEnabled: isDraftMode } = await draftMode();
  const { data } = await client.stories.get("home", {
    query: { version: "draft" },
  });
  const story = data?.story;
  if (!story) {
    return <main>Story not found</main>;
  }
  const content = await renderContent(story);
  // Only show live preview when in draft mode
  if (!isDraftMode) {
    return content;
  }

  return (
    <>
      <div style={{ background: "yellow", padding: "10px" }}>
        DRAFT MODE IS ON
      </div>
      <StoryblokPreview renderContent={renderContent}>
        {content}
      </StoryblokPreview>
    </>
  );
}
