// =============================================================================
// Storyblok React SDK v2 - Prototype Implementation
// =============================================================================
//
// This SDK is designed for React Server Components with these key principles:
//
// 1. NO GLOBAL STATE - Every client, registry, and cache is explicit
// 2. WORKER-SAFE - No module-level singletons that leak across requests
// 3. RSC-NATIVE - Server components fetch directly; hooks stay on client boundary
// 4. CHILDREN PATTERN - Nested bloks are pre-rendered as children, not resolved in client
//
// Two paths for live preview:
// - StoryblokServerStory: RSC + server action (Next.js App Router)
// - StoryblokClientStory: CSR-only (plain React, TanStack Start, SPAs)
// =============================================================================

// Types
export type {
  SbBlok,
  Story,
  BlokComponentProps,
  BlokComponent,
  ComponentsMap,
  SuspenseConfig,
} from "./types";

// Server Components (RSC path)
export {
  StoryblokServerComponent,
  StoryblokServerBlocks,
} from "./storyblok-server-component";
export { StoryblokServerStory } from "./storyblok-server-story";

// Client Components (CSR path)
export {
  StoryblokClientStory,
  ClientBlokResolver,
} from "./storyblok-client-story";
export { LivePreviewIsland } from "./live-preview-island";

// Re-export utilities from existing SDK
export { storyblokEditable } from "@storyblok/react/next";
