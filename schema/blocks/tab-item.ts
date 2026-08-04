import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const tabItemBlock = defineBlock({
  name: 'tab_item',
  is_root: false,
  is_nestable: true,
  description: '',
  fields: [
    defineField('label', {
      type: 'text',
    }),
    defineField('body', {
      type: 'bloks',
    }),
  ],
});
