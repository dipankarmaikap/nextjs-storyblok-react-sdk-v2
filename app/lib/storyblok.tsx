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

const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_DELIVERY_API_TOKEN!;
const storyblokRegion = process.env.NEXT_PUBLIC_STORYBLOK_REGION!;
export const client = createApiClient({
  accessToken: storyblokToken,
  region: storyblokRegion as "us" | "eu",
});

export const { StoryblokComponent, StoryblokBlocks } = createRegistry({
  components: {
    page: Page,
    grid: Grid,
    teaser: Teaser,
    feature: Feature,
    product_list: ProductList,
    accordion: Accordion,
    weather_widget: {
      component: WeatherWidget,
      fallback: <WeatherWidgetSkeleton />,
      suspense: true,
    },
  },
  fallback: FallbackBlock,
});
