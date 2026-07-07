"use client";

/**
 * Example: Accordion blok (Client Component)
 *
 * A client component with interactive state that renders nested content.
 *
 * KEY PATTERN:
 * - This component is marked 'use client'
 * - It receives `children` which are ALREADY RENDERED on the server
 * - It never imports the registry or resolves blocks itself
 * - Server components nested inside work perfectly because they're pre-rendered
 */

import { useState, type ReactNode } from "react";
import type { BlokComponentProps, SbBlok } from "../types";
import { storyblokEditable } from "@storyblok/react/next";

interface AccordionBlok extends SbBlok {
  component: "accordion";
  title: string;
  default_open?: boolean;
}

export function AccordionBlok({
  blok,
  children,
}: BlokComponentProps<AccordionBlok>): ReactNode {
  const [isOpen, setIsOpen] = useState(blok.default_open ?? false);

  return (
    <div
      {...storyblokEditable(blok)}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: isOpen ? "#f9fafb" : "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: 500,
          textAlign: "left",
        }}
      >
        <span>{blok.title}</span>
        <span
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #e5e7eb",
            background: "#fafafa",
          }}
        >
          {/* Children are pre-rendered - they can include server components! */}
          {children}
        </div>
      )}
    </div>
  );
}
