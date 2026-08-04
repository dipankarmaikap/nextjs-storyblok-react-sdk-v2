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
      className="overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-900"
      {...storyblokEditable(block)}
    >
      {/* Tab bar */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/40">
        {tabs.map((tab, i) => (
          <button
            key={tab._uid}
            onClick={() => setActiveIndex(i)}
            {...storyblokEditable(tab)}
            className={[
              "relative px-5 py-3 text-sm font-medium transition-colors duration-150 outline-none",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:transition-all after:duration-150",
              activeIndex === i
                ? "text-zinc-100 after:bg-indigo-500"
                : "text-zinc-500 hover:text-zinc-300 after:bg-transparent",
            ].join(" ")}
          >
            {tab.label ?? `Tab ${i + 1}`}
          </button>
        ))}
      </div>

      {/*
        Panels are ALREADY RENDERED on the server.
        We only swap which one is visible — no re-rendering happens.
      */}
      <div className="p-5">{panels[activeIndex]}</div>
    </div>
  );
}
