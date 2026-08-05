import { createRegistry, createApiClient } from "@storyblok/react/next";

import Page from "../components/Page";
import Grid from "../components/Grid";
import Teaser from "../components/Teaser";
import Feature from "../components/Feature";
import FallbackBlock from "../components/FallbackBlock";
import { WeatherWidget } from "../components/WeatherWidget";
import { WeatherWidgetSkeleton } from "../components/WeatherWidgetSkeleton";
import { ProductList } from "../components/ProductList";
import { Accordion } from "../components/Accordion";
import { Tabs } from "../components/Tabs";
import { TabItem } from "../components/TabItem";

/**
 * True on the preview deployment (STORYBLOK_ENV=preview).
 * False on production (env var absent or set to any other value).
 *
 * This is a module-level constant: it is evaluated once per cold start and
 * stays fixed for the lifetime of the process. Use it everywhere you need
 * to branch between "show draft content + live editing" and "show published
 * content + full caching".
 */
export const isPreview = process.env.STORYBLOK_ENV === "preview";

const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_DELIVERY_API_TOKEN!;
const storyblokRegion = process.env.NEXT_PUBLIC_STORYBLOK_REGION!;

export const client = createApiClient({
  accessToken: storyblokToken,
  region: storyblokRegion as "us" | "eu",
  // On the preview deployment, bypass the in-memory cache so every request
  // fetches the latest draft content from Storyblok directly.
  // On production, the default cache-first strategy (60 s TTL) applies.
  ...(isPreview && { cache: { strategy: "network-first" } }),
});

export const { StoryblokComponent, StoryblokBlocks } = createRegistry({
  components: {
    page: Page,
    grid: Grid,
    teaser: Teaser,
    feature: Feature,
    product_list: ProductList,
    accordion: Accordion,
    tabs: Tabs,
    tab_item: TabItem,
    weather_widget: {
      component: WeatherWidget,
      fallback: <WeatherWidgetSkeleton />,
      suspense: true,
    },
  },
  fallback: FallbackBlock,
});
