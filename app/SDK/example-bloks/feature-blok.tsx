/**
 * Example: Feature blok (Simple Server Component)
 *
 * A basic server component for simple content display.
 */

import type { ReactNode } from "react";
import type { BlokComponentProps, SbBlok } from "../types";
import { storyblokEditable } from "@storyblok/react/next";

interface FeatureBlok extends SbBlok {
  component: "feature";
  title: string;
  description?: string;
}

export function FeatureBlok({
  blok,
  children,
}: BlokComponentProps<FeatureBlok>): ReactNode {
  return (
    <div
      {...storyblokEditable(blok)}
      style={{
        padding: "16px",
        background: "#eff6ff",
        borderRadius: "8px",
        border: "1px solid #93c5fd",
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          color: "#1d4ed8",
          marginBottom: "8px",
          fontFamily: "monospace",
        }}
      >
        🖥️ SERVER COMPONENT
      </div>

      <h3 style={{ margin: "0 0 8px 0", color: "#1e40af" }}>{blok.title}</h3>

      {blok.description && (
        <p style={{ margin: 0, color: "#3b82f6" }}>{blok.description}</p>
      )}

      {/* Nested content */}
      {children && <div style={{ marginTop: "12px" }}>{children}</div>}
    </div>
  );
}
