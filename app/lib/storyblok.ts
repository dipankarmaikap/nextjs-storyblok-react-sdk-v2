import {
  createRegistry,
  createApiClient,
} from "@storyblok/react/v2";

import Page from "../components/Page";
import Grid from "../components/Grid";
import Teaser from "../components/Teaser";
import Feature from "../components/Feature";
import FallbackBlock from "../components/FallbackBlock";


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
  },
  fallback: FallbackBlock,
});
