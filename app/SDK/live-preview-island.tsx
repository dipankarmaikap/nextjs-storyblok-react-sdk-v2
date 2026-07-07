"use client";

/**
 * LivePreviewIsland - Client component that handles live preview updates.
 *
 * Subscribes to Storyblok bridge events and re-invokes the `render` server action
 * for each update, swapping the returned RSC payload into state.
 *
 * KEY BEHAVIOR:
 * - Client components inside the payload keep their position and type across swaps
 * - React reconciles them in place, so their local state SURVIVES
 * - This means accordion open/close state, form inputs, etc. persist during edits
 */

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { onStoryblokEditorEvent } from "@storyblok/live-preview";
import type { Story } from "./types";

interface LivePreviewIslandProps {
  /** Initial server-rendered content */
  initial: ReactNode;
  /** Server action that re-renders the story */
  render: (story: Story) => Promise<ReactNode>;
}

export function LivePreviewIsland({
  initial,
  render,
}: LivePreviewIslandProps) {
  const [payload, setPayload] = useState<ReactNode>(initial);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    const setup = async () => {
      unsubscribe = await onStoryblokEditorEvent((updatedStory) => {
        if (!mounted) return;

        startTransition(async () => {
          try {
            const newPayload = await render(updatedStory as Story);
            if (mounted) {
              setPayload(newPayload);
            }
          } catch (err) {
            console.error("[LivePreviewIsland] Failed to render:", err);
          }
        });
      });
    };

    setup();

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, [render]);

  return (
    <>
      {/* Loading indicator during server action */}
      {isPending && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #00b3b0, #1b243f)",
            zIndex: 9999,
            animation: "pulse 1s ease-in-out infinite",
          }}
        />
      )}
      {payload}
    </>
  );
}
