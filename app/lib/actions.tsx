"use server";

import type { ReactNode } from "react";
import type { Story } from "@storyblok/react/next";
import { StoryblokComponent } from "./storyblok";

/**
 * Server Action: Render Storyblok content
 */
export async function renderContent(story: Story): Promise<ReactNode> {
  const actionId = Math.random().toString(36).slice(2, 8);
  console.log(`[Server Action] renderContent called (${actionId})`);

  const result = <StoryblokComponent blok={story.content} />;

  console.log(`[Server Action] renderContent complete (${actionId})`);
  return <main>{result}</main>;
}
