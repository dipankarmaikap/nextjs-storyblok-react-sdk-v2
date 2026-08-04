import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const teaserBlock = defineBlock({
  name: 'teaser',
  is_root: false,
  is_nestable: true,
  fields: [
    defineField('headline', {
      type: 'text',
    }),
  ],
});
