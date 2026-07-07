"use client";

/**
 * Example: Tabs blok (Client Component with complex state)
 *
 * Another example of a client component that receives pre-rendered children.
 * This shows that more complex interactive patterns also work.
 */

import { useState, type ReactNode, Children, isValidElement } from "react";
import type { BlokComponentProps, SbBlok } from "../types";
import { storyblokEditable } from "@storyblok/react/next";

interface TabsBlok extends SbBlok {
  component: "tabs";
  tabs: Array<{ _uid: string; label: string }>;
}

export function TabsBlok({
  blok,
  children,
}: BlokComponentProps<TabsBlok>): ReactNode {
  const [activeIndex, setActiveIndex] = useState(0);

  // Convert children to array for indexed access
  const childArray = Children.toArray(children);

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
      <div
        style={{
          fontSize: "0.75rem",
          color: "#ea580c",
          padding: "8px 16px",
          background: "#fff7ed",
          borderBottom: "1px solid #fed7aa",
          fontFamily: "monospace",
        }}
      >
        💻 CLIENT COMPONENT (interactive tabs)
      </div>

      {/* Tab buttons */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e5e7eb",
          background: "#f9fafb",
        }}
      >
        {blok.tabs?.map((tab, index) => (
          <button
            key={tab._uid}
            onClick={() => setActiveIndex(index)}
            style={{
              padding: "12px 20px",
              border: "none",
              background: activeIndex === index ? "#fff" : "transparent",
              borderBottom:
                activeIndex === index ? "2px solid #3b82f6" : "2px solid transparent",
              cursor: "pointer",
              fontWeight: activeIndex === index ? 600 : 400,
              color: activeIndex === index ? "#1d4ed8" : "#6b7280",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content - shows the pre-rendered child at activeIndex */}
      <div style={{ padding: "16px" }}>
        {childArray[activeIndex] || (
          <p style={{ color: "#9ca3af" }}>No content for this tab</p>
        )}
      </div>
    </div>
  );
}
