import { StoryblokPreview } from "@storyblok/react/next/rsc";
import { renderContent } from "./lib/actions";
import { client, enableLivePreview } from "./lib/storyblok";

export default async function Home() {
  const { data } = await client.stories.get("home", {
    query: { version: "draft" },
  });
  const story = data?.story;

  if (!story) {
    return <main>Story not found</main>;
  }
  const content = await renderContent(story);

  if (!enableLivePreview) {
    return content;
  }
  return (
    <>
      <h1>Storyblok Live Preview!</h1>
      <StoryblokPreview
        renderContent={renderContent}
        initialContent={content}
      />
    </>
  );
}
