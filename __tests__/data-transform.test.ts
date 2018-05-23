/*!
  Copyright 2018 Google LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import {transformData} from '../src/data-transform';

const testMessageRows = {
  primaryRows: [
    [
      '(not set)',
      'originalurl.com\u00a0\u00a0proxiedurl.com\u00a0\u00a0alt text',
      196.5149696290909,
    ],
    ['feb', 'originalurl.com\u00a0\u00a0proxiedurl.com\u00a0\u00a0', 0],
  ],
  comparisonRows: [
    [
      '(not set)',
      'originalurl.com\u00a0\u00a0proxiedurl.com\u00a0\u00a0alt text',
      198.2720811099253,
    ],
    [
      'feb',
      'originalurl.com\u00a0\u00a0proxiedurl.com\u00a0\u00a0alt text',
      null,
    ],
  ],
};

const testMessageSchema = [
  {
    name: 'c_id',
    label: 'Campaign',
    concept: 'DIMENSION',
    dataType: 'STRING',
    semantic: 'TEXT',
  },
  {
    name: 'b_id',
    label: 'Some image url',
    concept: 'DIMENSION',
    dataType: 'STRING',
    semantic: 'IMAGE',
  },
  {
    name: 'a_id',
    label: 'Avg. Order Value',
    concept: 'METRIC',
    dataType: 'LONG',
    semantic: 'CURRENCY',
    semanticOption: 'USD',
  },
];

const testMessageStyle = {
  useSingleColor: true,
  reverseColor: false,
  showText: true,
  fontSize: 10,
  fontColor: {
    color: '#fff',
  },
  font: 'auto',
};

const testMessageData = {
  type: 'RENDER',
  rows: testMessageRows,
  schema: testMessageSchema,
  style: testMessageStyle,
};

const testMessage = {
  data: testMessageData,
};

test('transformData works as expected', () => {
  const expectedSchema = {
    a_id: {
      concept: 'METRIC',
      id: 'a_id',
      name: 'Avg. Order Value',
      type: 'CURRENCY_USD',
    },
    b_id: {
      concept: 'DIMENSION',
      id: 'b_id',
      name: 'Some image url',
      type: 'IMAGE',
    },
    c_id: {
      concept: 'DIMENSION',
      id: 'c_id',
      name: 'Campaign',
      type: 'TEXT',
    },
  };
  const expectedFields = [
    {
      id: 'c_id',
      name: 'Campaign',
      concept: 'DIMENSION',
      type: 'TEXT',
    },
    {
      id: 'b_id',
      name: 'Some image url',
      concept: 'DIMENSION',
      type: 'IMAGE',
    },
    {
      id: 'a_id',
      name: 'Avg. Order Value',
      concept: 'METRIC',
      type: 'CURRENCY_USD',
    },
  ];
  const expctedRows = [
    {
      a_id: 198.2720811099253,
      c_id: '(not set)',
      isComparisonRow: true,
      b_id: {
        originalUrl: 'originalurl.com',
        proxiedUrl: 'proxiedurl.com',
        altText: 'alt text',
      },
    },
    {
      a_id: null,
      c_id: 'feb',
      isComparisonRow: true,
      b_id: {
        originalUrl: 'originalurl.com',
        proxiedUrl: 'proxiedurl.com',
        altText: 'alt text',
      },
    },
    {
      a_id: 196.5149696290909,
      c_id: '(not set)',
      isComparisonRow: false,
      b_id: {
        originalUrl: 'originalurl.com',
        proxiedUrl: 'proxiedurl.com',
        altText: 'alt text',
      },
    },
    {
      a_id: 0,
      c_id: 'feb',
      isComparisonRow: false,
      b_id: {
        originalUrl: 'originalurl.com',
        proxiedUrl: 'proxiedurl.com',
        altText: '',
      },
    },
  ];

  const expected = {
    type: 'RENDER',
    style: testMessageStyle,
    fieldById: expectedSchema,
    fields: expectedFields,
    rows: expctedRows,
  };

  const actual = transformData(testMessage);
  expect(actual).toEqual(expected);
});
