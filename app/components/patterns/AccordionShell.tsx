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
      className="overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-900 transition-colors duration-150 hover:border-zinc-600"
      {...storyblokEditable(block)}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-base font-semibold text-zinc-100">
          {block.title ?? "Accordion"}
        </span>
        {/* Chevron rotates 180° when open */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={[
            "shrink-0 text-zinc-400 transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/*
        The children here are ALREADY RENDERED on the server.
        We're just showing/hiding them, not re-rendering.
      */}
      {open && (
        <div className="border-t border-zinc-800 px-5 py-4">{children}</div>
      )}
    </section>
  );
}
