// =============================================================================
// Server-side Registry for Server Components
// =============================================================================
//
// IMPORTANT: Import createRegistry from '@storyblok/react/next/rsc'
// This entry point includes 'server-only', so importing it in a 'use client'
// file will cause a build error - exactly what we want.
//
// For client components that need nested blocks (accordions, tabs), use the
// "pre-render children" pattern - see AccordionBlok below.
// =============================================================================

// NOTE: Once the SDK is published, this would be:
// import { createRegistry } from "@storyblok/react/next/rsc";
// For now we use the regular import since we're using the npm-published version
import { createRegistry, type SbBlokData } from "@storyblok/react/next";
import { ProductList } from "../components/ProductList";
import { AccordionShell } from "../components/patterns/AccordionShell";

// -----------------------------------------------------------------------------
// AccordionBlok: The pattern for server components inside client wrappers
// -----------------------------------------------------------------------------
// 
// This is a SERVER component that:
// 1. Pre-renders nested blocks using StoryblokBlocks (on the server)
// 2. Passes the rendered content to a CLIENT shell component
//
// The shell only handles interactivity (open/close state), it receives
// already-rendered children - no Storyblok imports needed in the client.

interface AccordionBlokProps {
  blok: SbBlokData & {
    title: string;
    items: SbBlokData[];
  };
}

function AccordionBlok({ blok }: AccordionBlokProps) {
  // Pre-render nested content ON THE SERVER using the registry
  const renderedContent = <StoryblokBlocks blocks={blok.items} />;

  return (
    <AccordionShell title={blok.title} blok={blok as SbBlokData}>
      {renderedContent}
    </AccordionShell>
  );
}

// -----------------------------------------------------------------------------
// Create the registry
// -----------------------------------------------------------------------------

export const { StoryblokComponent, StoryblokBlocks } = createRegistry({
  components: {
    // Server component with DB access
    product_list: {
      component: ProductList,
      suspense: true,
    },

    // Server component that wraps a client shell
    accordion: AccordionBlok as React.ComponentType<{ blok: SbBlokData }>,
  },

  fallback: ({ blok }) => (
    <div className="rounded border border-red-500 bg-red-950/20 p-4 text-red-400">
      Unknown component: {blok.component}
    </div>
  ),
});
