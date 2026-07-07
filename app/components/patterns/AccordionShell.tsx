"use client";

// AccordionShell - Pure client component for accordion UI
// This component is "dumb" - it only handles expand/collapse state
// It receives pre-rendered content as children

import { useState, type ReactNode } from "react";
import { storyblokEditable, type SbBlokData } from "@storyblok/react/next";

interface AccordionShellProps {
  title: string;
  children: ReactNode; // Pre-rendered content from server
  blok: SbBlokData;
  defaultOpen?: boolean;
}

export function AccordionShell({
  title,
  children,
  blok,
  defaultOpen = false,
}: AccordionShellProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      className="rounded-lg border border-zinc-600 bg-zinc-800"
      {...storyblokEditable(blok)}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="text-lg font-medium text-zinc-100">{title}</span>
        <span className="text-zinc-400">{open ? "▲" : "▼"}</span>
      </button>

      {/* 
        The children here are ALREADY RENDERED on the server.
        We're just showing/hiding them, not re-rendering.
        This is safe because:
        1. Server components were resolved on the server
        2. The HTML is already generated
        3. We're just toggling CSS visibility essentially
      */}
      {open && <div className="border-t border-zinc-700 p-4">{children}</div>}
    </section>
  );
}
