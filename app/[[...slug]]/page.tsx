import { StoryblokPreviewRsc } from "@storyblok/react/client";
import { renderContent } from "../lib/actions";
import { client, isPreview } from "../lib/storyblok";
import { PreviewBanner } from "../components/PreviewBanner";
import { StoryContent } from "../components/StoryContent";

type Params = Promise<{ slug?: string[] }>;

export default async function CatchAllPage({ params }: { params: Params }) {
  const { slug } = await params;
  const storySlug = slug?.join("/") ?? "home";
  const storyPromise = client.stories.get(storySlug, {
    query: { version: isPreview ? "draft" : "published" },
  });
  return <PageContent storyPromise={storyPromise} />;
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

  const content = <StoryContent story={story} />;

  if (!isPreview) {
    return content;
  }

  return (
    <>
      <PreviewBanner />
      <StoryblokPreviewRsc renderContent={renderContent}>
        {content}
      </StoryblokPreviewRsc>
    </>
  );
}
