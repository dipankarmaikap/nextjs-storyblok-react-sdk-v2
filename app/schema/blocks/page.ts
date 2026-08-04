import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const pageBlock = defineBlock({
  name: 'page',
  is_root: true,
  is_nestable: false,
  fields: [
    defineField('body', {
      type: 'bloks',
    }),
  ],
});
