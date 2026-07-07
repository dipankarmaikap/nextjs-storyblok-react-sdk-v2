"use client";

/**
 * StoryblokClientStory - CSR fallback for live preview.
 *
 * Use this for:
 * - Plain React SPAs
 * - TanStack Start (createServerFn is not interchangeable with 'use server')
 * - Any framework where RSC integration is not yet validated
 * - Fallback when you need client-side only rendering
 *
 * This fetches/accepts the story and subscribes to bridge events,
 * re-rendering client-side on each edit. No server roundtrip per edit.
 */

import {
  useEffect,
  useState,
  type ReactNode,
  type ComponentType,
} from "react";
import { onStoryblokEditorEvent } from "@storyblok/live-preview";
import type { Story, SbBlok, ComponentsMap, BlokComponentProps } from "./types";

/**
 * Client-side recursive component resolver.
 * Similar to StoryblokServerComponent but runs entirely on the client.
 */
function ClientBlokResolver({
  blok,
  components,
  story,
}: {
  blok: SbBlok;
  components: ComponentsMap;
  story?: Story;
}): ReactNode {
  const Component = components[blok.component];

  if (!Component) {
    return (
      <div
        style={{
          padding: 12,
          border: "1px dashed #b91c1c",
          borderRadius: 6,
          color: "#7f1d1d",
          fontFamily: "monospace",
          fontSize: 12,
        }}
      >
        [Unknown blok: {blok.component}]
      </div>
    );
  }

  // Recursively render nested body as children
  const body = Array.isArray(blok.body) ? blok.body : [];
  const children = body.length ? (
    <>
      {body.map((child) => (
        <ClientBlokResolver
          key={child._uid}
          blok={child}
          components={components}
          story={story}
        />
      ))}
    </>
  ) : undefined;

  return (
    <Component blok={blok} story={story}>
      {children}
    </Component>
  );
}

interface StoryblokClientStoryProps {
  /** Initial story (from SSR or client fetch) */
  story: Story;
  /** Component map for resolving bloks */
  components: ComponentsMap;
  /** Render function receiving the current story */
  children: (story: Story) => ReactNode;
}

/**
 * StoryblokClientStory - Client-side story renderer with live preview.
 *
 * @example
 * ```tsx
 * // For CSR/SPA apps
 * <StoryblokClientStory story={story} components={components}>
 *   {(currentStory) => (
 *     <ClientBlokResolver
 *       blok={currentStory.content}
 *       components={components}
 *       story={currentStory}
 *     />
 *   )}
 * </StoryblokClientStory>
 * ```
 */
export function StoryblokClientStory({
  story,
  children,
}: StoryblokClientStoryProps) {
  const [currentStory, setCurrentStory] = useState<Story>(story);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    const setup = async () => {
      unsubscribe = await onStoryblokEditorEvent((updatedStory) => {
        if (!mounted) return;
        setCurrentStory(updatedStory as Story);
      });
    };

    setup();

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  return <>{children(currentStory)}</>;
}

// Export the client resolver for use with StoryblokClientStory
export { ClientBlokResolver };
