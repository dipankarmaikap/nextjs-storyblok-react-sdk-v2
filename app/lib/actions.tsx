"use server";

import type { ReactNode } from "react";
import type { Story } from "@storyblok/react/next";
import { StoryContent } from "../components/StoryContent";

/**
 * Server Action: Render Storyblok content
 */
export async function renderContent(story: Story): Promise<ReactNode> {
  return <StoryContent story={story} />;
}
