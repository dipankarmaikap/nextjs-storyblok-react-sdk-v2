import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const accordionBlock = defineBlock({
  name: 'accordion',
  is_root: false,
  is_nestable: true,
  description: '',
  fields: [
    defineField('title', {
      type: 'text',
    }),
    defineField('default_open', {
      default_value: false,
      type: 'boolean',
    }),
    defineField('body', {
      type: 'bloks',
    }),
  ],
});
