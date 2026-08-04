import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const tabsBlock = defineBlock({
  name: 'tabs',
  is_root: false,
  is_nestable: true,
  description: '',
  fields: [
    defineField('body', {
      allow: [
        'tab_item',
      ],
      type: 'bloks',
    }),
  ],
});
