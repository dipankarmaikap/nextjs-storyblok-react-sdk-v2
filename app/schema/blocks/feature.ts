import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const featureBlock = defineBlock({
  name: 'feature',
  is_root: false,
  is_nestable: true,
  fields: [
    defineField('description', {
      allow_custom_attributes: true,
      rtl: true,
      style_options: [
        {
          _uid: '434bdfde-20d0-4c3f-9844-6effa87f7832',
          name: 'r',
          value: 'w',
        },
        {
          _uid: '7dc167cc-5b83-4f95-a2c4-4c8ba76eae48',
          name: 'ewe',
          value: 'sdv',
        },
      ],
      type: 'richtext',
    }),
    defineField('name', {
      type: 'text',
    }),
  ],
});
