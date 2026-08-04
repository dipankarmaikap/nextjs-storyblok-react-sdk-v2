import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const gridBlock = defineBlock({
  name: 'grid',
  is_root: false,
  is_nestable: true,
  fields: [
    defineField('columns', {
      type: 'bloks',
    }),
  ],
});
