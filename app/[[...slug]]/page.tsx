import { StoryblokPreview } from "@storyblok/react/rsc";
import { renderContent } from "../lib/actions";
import { client, isPreview } from "../lib/storyblok";
import { PreviewBanner } from "../components/PreviewBanner";

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

  return (
    <>
      <PreviewBanner />
      <StoryblokPreview story={story} renderContent={renderContent} />
    </>
  );
}
