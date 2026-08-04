import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const weatherWidgetBlock = defineBlock({
  name: 'weather_widget',
  is_root: false,
  is_nestable: true,
  description: '',
  fields: [
    defineField('title', {
      type: 'text',
    }),
    defineField('location', {
      default_value: 'kolkata',
      options: [
        {
          _uid: 'ecb8f332-2f42-48d7-974c-68e39b7bbb40',
          name: 'Kolkata',
          value: 'kolkata',
        },
        {
          _uid: 'bde8fb5f-7b91-4c11-b4d4-3e042b60678f',
          name: 'Paris',
          value: 'paris',
        },
        {
          _uid: 'eec943b5-e1ab-4a37-8c6b-5e92026abc2a',
          name: 'Tokyo',
          value: 'tokyo',
        },
        {
          _uid: '1ba710bd-9b5b-443e-9481-df6e2928927e',
          name: 'London',
          value: 'london',
        },
      ],
      type: 'option',
      use_uuid: true,
    }),
  ],
});
