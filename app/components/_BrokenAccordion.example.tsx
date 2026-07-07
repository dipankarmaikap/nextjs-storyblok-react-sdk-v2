/**
 * ============================================================================
 * ANTI-PATTERN EXAMPLE - DO NOT USE
 * ============================================================================
 * 
 * This file demonstrates the WRONG way to build an interactive component
 * that needs to render server-only content.
 * 
 * THE PROBLEM:
 * ------------
 * When a Client Component ('use client') imports a module that contains
 * server-only code, Next.js will fail at build time with:
 * 
 *   "You're importing a component that needs 'server-only'. That only works
 *    in a Server Component but one of its parents is marked with 'use client'"
 * 
 * In this broken example:
 *   BrokenAccordion ('use client')
 *     └── imports StoryblokBlocks from registry
 *         └── registry imports ProductList
 *             └── ProductList imports ProductRows  
 *                 └── ProductRows imports db.ts (has 'server-only')
 * 
 * The entire import chain gets pulled into the client bundle, causing the error.
 * 
 * THE SOLUTION:
 * -------------
 * See the correct pattern in:
 *   - ./Accordion.tsx (Server Component wrapper)
 *   - ./patterns/AccordionShell.tsx (Client Component shell)
 * 
 * The fix is to:
 * 1. Keep the interactive "shell" as a Client Component
 * 2. Create a Server Component wrapper that renders children on the server
 * 3. Pass pre-rendered content as `children` to the shell
 * 
 * ============================================================================
 */

// 'use client';
// 
// import { SbBlokData } from '@storyblok/react/next';
// import { Suspense, useState } from 'react';
// import { StoryblokBlocks } from '../lib/storyblok'; // <-- THIS IMPORT BREAKS THE BUILD
// 
// export function BrokenAccordion({ blok }) {
//   const [open, setOpen] = useState(blok.default_open || false);
//   
//   return (
//     <div>
//       <button onClick={() => setOpen(!open)}>{blok.title}</button>
//       {open && (
//         <div>
//           {/* WRONG: Importing server components into client component */}
//           <StoryblokBlocks blocks={blok.body} />
//         </div>
//       )}
//     </div>
//   );
// }

export {}; // Make this a module but export nothing
