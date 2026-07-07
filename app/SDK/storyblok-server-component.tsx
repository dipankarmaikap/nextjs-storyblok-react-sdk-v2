import { Suspense, type ReactNode } from "react";
import type { SbBlok, ComponentsMap, SuspenseConfig, Story } from "./types";
import { storyblokEditable } from "@storyblok/react/next";

/**
 * Props for StoryblokServerComponent
 */
interface StoryblokServerComponentProps {
  /** The blok data to render */
  blok: SbBlok;
  /** Map of component names to implementations */
  components: ComponentsMap;
  /** Optional story context passed to all bloks */
  story?: Story;
  /** Suspense configuration for async components */
  suspense?: SuspenseConfig;
}

/**
 * Recursive server component that resolves bloks through a component registry.
 *
 * KEY DESIGN:
 * - Pre-renders nested `body` bloks as `children` BEFORE passing to the component
 * - This means client components receive already-rendered ReactNode
 * - Client components never need to import the registry
 * - Server components with DB access can be nested inside client components
 *
 * @example
 * ```tsx
 * // In your render server action:
 * async function render(story: Story) {
 *   'use server';
 *   return <StoryblokServerComponent blok={story.content} components={components} />;
 * }
 * ```
 */
export function StoryblokServerComponent({
  blok,
  components,
  story,
  suspense,
}: StoryblokServerComponentProps): ReactNode {
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
          margin: "8px 0",
        }}
      >
        [Unknown blok: <strong>{blok.component}</strong>]
      </div>
    );
  }

  // Pre-render nested body bloks as children
  // This is the KEY to making server components work inside client wrappers
  const body = Array.isArray(blok.body) ? blok.body : [];
  const children = body.length ? (
    <>
      {body.map((child) => (
        <StoryblokServerComponent
          key={child._uid}
          blok={child}
          components={components}
          story={story}
          suspense={suspense}
        />
      ))}
    </>
  ) : undefined;

  // Check if this component needs Suspense wrapping
  const needsSuspense = suspense?.components?.includes(blok.component);

  const element = (
    <Component blok={blok} story={story} {...storyblokEditable(blok)}>
      {children}
    </Component>
  );

  if (needsSuspense) {
    const fallback =
      suspense?.fallbacks?.[blok.component] ?? suspense?.fallback ?? null;
    return <Suspense fallback={fallback}>{element}</Suspense>;
  }

  return element;
}

/**
 * Render multiple bloks at the top level.
 * Useful for rendering story.content.body directly.
 */
export function StoryblokServerBlocks({
  bloks,
  components,
  story,
  suspense,
}: {
  bloks: SbBlok[];
  components: ComponentsMap;
  story?: Story;
  suspense?: SuspenseConfig;
}): ReactNode {
  if (!bloks || bloks.length === 0) {
    return null;
  }

  return (
    <>
      {bloks.map((blok) => (
        <StoryblokServerComponent
          key={blok._uid}
          blok={blok}
          components={components}
          story={story}
          suspense={suspense}
        />
      ))}
    </>
  );
}
