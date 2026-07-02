import { client, StoryblokComponent } from "./lib/storyblok";

export default async function Home() {
  const { data } = await client.stories.get("home", {
    query: { version: "draft" },
  });
  const story = data?.story;

  if (!story) {
    return <main>Story not found</main>;
  }
  return (
    <main>
      <h1>Hello, World!</h1>
      <StoryblokComponent blok={story.content} />
    </main>
  );
}
