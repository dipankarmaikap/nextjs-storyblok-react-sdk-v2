"use server";

import type { ReactNode } from "react";
import type { Story } from "@storyblok/react/next";
import { StoryblokComponent } from "./storyblok";

/**
 * Server Action: Render Storyblok content
 */
export async function renderContent(story: Story): Promise<ReactNode> {
  const result = <StoryblokComponent blok={story.content} />;
  return <main>{result}</main>;
}
