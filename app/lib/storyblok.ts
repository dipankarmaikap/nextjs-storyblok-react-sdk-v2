import {
  createRegistry,
  createApiClient,
} from "@storyblok/react/next";

import Page from "../components/Page";
import Grid from "../components/Grid";
import Teaser from "../components/Teaser";
import Feature from "../components/Feature";
import FallbackBlock from "../components/FallbackBlock";
import { WeatherWidget } from "../components/WeatherWidget";


const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_DELIVERY_API_TOKEN!;
const storyblokRegion = process.env.NEXT_PUBLIC_STORYBLOK_REGION!;
export const enableLivePreview = process.env.NEXT_PUBLIC_STORYBLOK_ENABLE_LIVEPREVIEW === "true";

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
    'weather_widget': WeatherWidget,
  },
  fallback: FallbackBlock,
});
