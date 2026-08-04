import { StoryblokPreview } from "@storyblok/react/next/rsc";
import { draftMode } from "next/headers";
import { renderContent } from "./lib/actions";
import { client } from "./lib/storyblok";
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
  const content = await renderContent(story);

  if (!isDraftMode) {
    return content;
  }

  return (
    <>
      <DraftModeBanner />
      <StoryblokPreview renderContent={renderContent}>
        {content}
      </StoryblokPreview>
    </>
  );
}
