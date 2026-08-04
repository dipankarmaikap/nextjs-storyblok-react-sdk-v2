"use client";

import { useState, type ReactNode } from "react";
import React from "react";
import { storyblokEditable } from "@storyblok/react/next";
import { Block } from "@/schema/schema";

interface TabsShellProps {
  block: Block<"tabs">;
  children: ReactNode; // Pre-rendered tab panels from server
}

export function TabsShell({ block, children }: TabsShellProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const panels = React.Children.toArray(children);
  const tabs = block.body ?? [];

  return (
    <div
      className="rounded-lg border border-zinc-600 bg-zinc-800"
      {...storyblokEditable(block)}
    >
      {/* Tab buttons — labels read from block data, editable in Visual Editor */}
      <div className="flex border-b border-zinc-700">
        {tabs.map((tab, i) => (
          <button
            key={tab._uid}
            onClick={() => setActiveIndex(i)}
            {...storyblokEditable(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeIndex === i
                ? "border-b-2 border-zinc-100 text-zinc-100"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label ?? `Tab ${i + 1}`}
          </button>
        ))}
      </div>

      {/*
        The panels here are ALREADY RENDERED on the server.
        We only swap which one is visible — no re-rendering happens.
      */}
      <div className="p-4">{panels[activeIndex]}</div>
    </div>
  );
}
