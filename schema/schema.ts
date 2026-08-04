import { defineSchema } from '@storyblok/schema';
import type { Schema as InferSchema, Story as InferStory } from '@storyblok/schema';
import type { BlockContent, MapiStory as InferStoryMapi } from '@storyblok/schema';

import { accordionBlock } from './blocks/accordion';
import { featureBlock } from './blocks/feature';
import { gridBlock } from './blocks/grid';
import { pageBlock } from './blocks/page';
import { productListBlock } from './blocks/product-list';
import { tabItemBlock } from './blocks/tab-item';
import { tabsBlock } from './blocks/tabs';
import { teaserBlock } from './blocks/teaser';
import { weatherWidgetBlock } from './blocks/weather-widget';

export const schema = defineSchema({
  blocks: {
    accordionBlock,
    featureBlock,
    gridBlock,
    pageBlock,
    productListBlock,
    tabItemBlock,
    tabsBlock,
    teaserBlock,
    weatherWidgetBlock,
  },
});

export type Schema = InferSchema<typeof schema>;
export type Blocks = Schema['blocks'];
export type FieldPlugins = Schema['fieldPlugins'];
export type Story = InferStory<Blocks, FieldPlugins>;
export type StoryMapi = InferStoryMapi<Blocks, FieldPlugins>;

// Type a component's props by block name: `Block<"hero">`.
export type Block<TName extends Blocks['name']> = BlockContent<
  Extract<Blocks, { name: TName }>,
  Blocks,
  FieldPlugins
>;

// Loose union of every block's content, for a dynamic component dispatcher.
export type AnyBlock = BlockContent<Blocks, Blocks, FieldPlugins>;
