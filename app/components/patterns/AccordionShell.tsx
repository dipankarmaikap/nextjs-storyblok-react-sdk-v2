"use client";

// AccordionShell - Pure client component for accordion UI
// This component is "dumb" - it only handles expand/collapse state
// It receives pre-rendered content as children

import { useState, type ReactNode } from "react";
import { storyblokEditable } from "@storyblok/react/next";
import { Block } from "@/schema/schema";

interface AccordionShellProps {
  block: Block<"accordion">;
  children: ReactNode; // Pre-rendered content from server
}

export function AccordionShell({ block, children }: AccordionShellProps) {
  const [open, setOpen] = useState(block.default_open ?? false);

  return (
    <section
      className="rounded-lg border border-zinc-600 bg-zinc-800"
      {...storyblokEditable(block)}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="text-lg font-medium text-zinc-100">{block.title ?? "Accordion"}</span>
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
