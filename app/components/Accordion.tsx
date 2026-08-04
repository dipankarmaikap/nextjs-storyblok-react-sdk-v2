// Accordion - Server Component wrapper for the accordion blok
//
// PATTERN: Server Component Composition
// ======================================
// This demonstrates the correct way to combine client interactivity
// with server-only data fetching in Next.js App Router.
//
// The Problem:
// ------------
// Client Components (with 'use client') cannot import server-only code.
// If your component needs both interactivity AND server-rendered children,
// you'll get a build error if you try to import server components directly.
//
// The Solution:
// -------------
// 1. Create a "shell" Client Component that handles interactivity
//    - Only manages UI state (open/closed, etc.)
//    - Accepts `children` prop for content
//    - Does NOT import any server-only code
//
// 2. Create a Server Component wrapper (this file)
//    - Imports the shell component
//    - Renders server components and passes them as `children`
//    - The children are pre-rendered on the server
//
// Why This Works:
// ---------------
// - The Server Component (this file) runs on the server
// - It can safely import and render other Server Components
// - It passes the ALREADY-RENDERED content to the Client Component
// - The Client Component just shows/hides the pre-rendered HTML

import { AccordionShell } from "./patterns/AccordionShell";
import { StoryblokBlocks } from "../lib/storyblok";
import { Block } from "@/schema/schema";

type AccordionProps = { block: Block<"accordion"> };

export function Accordion({ block }: AccordionProps) {
  return (
    <AccordionShell block={block}>
      {/* 
        StoryblokBlocks renders on the server.
        The result (React elements) is passed as children to AccordionShell.
        AccordionShell (Client Component) receives pre-rendered content.
      */}
      {block.body?.length ? <StoryblokBlocks blocks={block.body} /> : null}
    </AccordionShell>
  );
}
