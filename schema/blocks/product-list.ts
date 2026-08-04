import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const productListBlock = defineBlock({
  name: 'product_list',
  is_root: false,
  is_nestable: true,
  description: '',
  fields: [
    defineField('title', {
      type: 'text',
    }),
    defineField('category', {
      options: [
        {
          _uid: '77f8906a-d9a6-46ef-a7f8-94e9d6125ddd',
          name: 'electronics',
          value: 'electronics',
        },
        {
          _uid: 'd4e80044-6b83-49fd-add6-c43f80f605e1',
          name: 'sports',
          value: 'sports',
        },
        {
          _uid: '1d815f0f-0150-4eb5-a041-acb058bed73d',
          name: 'home',
          value: 'home',
        },
      ],
      type: 'option',
      use_uuid: true,
    }),
  ],
});
