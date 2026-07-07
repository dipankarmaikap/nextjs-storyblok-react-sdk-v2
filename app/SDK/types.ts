import type { ReactNode, ComponentType } from "react";

/**
 * Base interface for Storyblok block data.
 * All bloks have a unique ID and component type.
 */
export interface SbBlok {
  _uid: string;
  component: string;
  _editable?: string;
  body?: SbBlok[];
  [key: string]: unknown;
}

/**
 * Storyblok story structure.
 */
export interface Story<T extends SbBlok = SbBlok> {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  content: T;
  created_at: string;
  published_at: string | null;
  [key: string]: unknown;
}

/**
 * Props that every blok component receives.
 * - `blok`: The block data from Storyblok
 * - `children`: Pre-rendered nested blocks (resolved on server)
 * - `story`: Optional story context
 */
export interface BlokComponentProps<T extends SbBlok = SbBlok> {
  blok: T;
  children?: ReactNode;
  story?: Story;
}

/**
 * A component that can render a Storyblok blok.
 * Must accept `blok` and optionally `children` for nested content.
 */
export type BlokComponent<T extends SbBlok = SbBlok> = ComponentType<
  BlokComponentProps<T>
>;

/**
 * Map of component names to their implementations.
 * This is passed explicitly to the resolver - no module globals.
 * 
 * Uses `any` for the blok type to allow components with specific
 * blok types (e.g., BlokComponent<PageBlok>) to be assigned.
 * The resolver handles type safety at runtime.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentsMap = Record<string, BlokComponent<any>>;

/**
 * Configuration for Suspense boundaries around async components.
 */
export interface SuspenseConfig {
  /** Components that should be wrapped in Suspense */
  components?: string[];
  /** Default fallback for Suspense boundaries */
  fallback?: ReactNode;
  /** Per-component fallbacks */
  fallbacks?: Record<string, ReactNode>;
}
