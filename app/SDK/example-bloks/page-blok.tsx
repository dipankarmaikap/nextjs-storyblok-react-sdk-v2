/**
 * Example: Page blok (Server Component)
 *
 * A simple container that renders nested bloks.
 * Receives pre-rendered children - no registry import needed.
 */

import type { ReactNode } from "react";
import type { BlokComponentProps, SbBlok } from "../types";
import { storyblokEditable } from "@storyblok/react/next";

interface PageBlok extends SbBlok {
  component: "page";
  title?: string;
}

export function PageBlok({
  blok,
  children,
}: BlokComponentProps<PageBlok>): ReactNode {
  return (
    <article
      {...storyblokEditable(blok)}
      style={{
        padding: "24px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {blok.title && (
        <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
          {blok.title}
        </h1>
      )}
      {/* Children are pre-rendered nested bloks */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {children}
      </div>
    </article>
  );
}
