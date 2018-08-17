/*!
  Copyright 2018 Google LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  https://www.apache.org/licenses/LICENSE-2.0

  Unless mind by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import {transformData, destructImage} from '../src/data-transform';
import * as DS from '../src/data-studio-types';
import * as Lib from '../src/library-types';

test('destructImage all three fields present', () => {
  const input = 'originalurl.com\u00a0\u00a0proxiedurl.com\u00a0\u00a0alt text';
  const expected = {
    originalUrl: 'originalurl.com',
    proxiedUrl: 'proxiedurl.com',
    altText: 'alt text',
  };
  const actual = destructImage(input);
  expect(actual).toEqual(expected);
});

test('destructImage two fields present', () => {
  const input = 'originalurl.com\u00a0\u00a0proxiedurl.com';
  const expected = {
    originalUrl: 'originalurl.com',
    proxiedUrl: 'proxiedurl.com',
    altText: undefined,
  };
  const actual = destructImage(input);
  expect(actual).toEqual(expected);
});

test('transformData multiple dimension config.', () => {
  const input: DS.Message = {
    type: 'RENDER',
    schema: [
      {
        name: 'campaignId',
        label: 'Campaign',
        concept: 'DIMENSION',
        dataType: 'STRING',
        semantic: 'TEXT',
      },
      {
        name: 'dateId',
        label: 'Date',
        concept: 'DIMENSION',
        dataType: 'STRING',
        semantic: 'YEAR_MONTH_DAY',
      },
      {
        name: 'orderValueId',
        label: 'Order Value',
        concept: 'METRIC',
        dataType: 'NUMBER',
        semantic: 'CURRENCY',
        semanticOption: 'USD',
      },
    ],
    rows: {
      primaryRows: [['(not set)', '03-27-1992', 100], ['feb', '03-28-1992', 0]],
      comparisonRows: [
        ['(not set)', '03-29-1992', 200],
        ['feb', '03-30-1992', null],
      ],
    },
    style: {},
    data: [
      {
        id: 'hi',
        heading: 'his',
        elements: [
          {
            id: 'configId2',
            label: 'ConfigId2 Label',
            type: DS.ConfigElementType.DIMENSION,
            options: {
              max: 2,
              min: 2,
              supportedTypes: [],
              options: [],
            },
          },
          {
            id: 'configId1',
            label: 'ConfigId1 Label',
            type: DS.ConfigElementType.METRIC,
            options: {
              max: 1,
              min: 1,
              supportedTypes: [],
              options: [],
            },
          },
        ],
      },
    ],
  };
  const expected: Lib.Message = {
    type: 'RENDER',
    fields: {
      configId2: [
        {
          id: 'configId2',
          concept: 'DIMENSION',
          dataStudioId: 'campaignId',
          name: 'Campaign',
          type: 'TEXT',
        },
        {
          id: 'configId2',
          concept: 'DIMENSION',
          dataStudioId: 'dateId',
          name: 'Date',
          type: 'YEAR_MONTH_DAY',
        },
      ],
      configId1: [
        {
          id: 'configId1',
          concept: 'METRIC',
          dataStudioId: 'orderValueId',
          name: 'Order Value',
          type: 'CURRENCY_USD',
        },
      ],
    },
    rows: [
      {
        configId1: [200],
        configId2: ['(not set)', '03-29-1992'],
        dataTag: 'comparisonRow',
      },
      {
        configId1: [null],
        configId2: ['feb', '03-30-1992'],
        dataTag: 'comparisonRow',
      },
      {
        configId1: [100],
        configId2: ['(not set)', '03-27-1992'],
        dataTag: 'primaryRow',
      },
      {
        configId1: [0],
        configId2: ['feb', '03-28-1992'],
        dataTag: 'primaryRow',
      },
    ],
    style: {},
  };

  const actual = transformData(input);
  expect(actual).toEqual(expected);
});

test('transformData multiple metric, multiple dimension config.', () => {
  const input: DS.Message = {
    type: 'RENDER',
    schema: [
      {
        name: 'campaignId',
        label: 'Campaign',
        concept: 'DIMENSION',
        dataType: 'STRING',
        semantic: 'TEXT',
      },
      {
        name: 'dateId',
        label: 'Date',
        concept: 'DIMENSION',
        dataType: 'STRING',
        semantic: 'YEAR_MONTH_DAY',
      },
      {
        name: 'orderWeight',
        label: 'Order Weight',
        concept: 'METRIC',
        dataType: 'NUMBER',
        semantic: 'NUMBER',
      },
      {
        name: 'orderValueId',
        label: 'Order Value',
        concept: 'METRIC',
        dataType: 'NUMBER',
        semantic: 'CURRENCY',
        semanticOption: 'USD',
      },
    ],
    rows: {
      primaryRows: [
        ['jan', '03-29-1992', 1, 100],
        ['feb', '03-30-1992', 2, 200],
      ],
      comparisonRows: [],
    },
    style: {},
    data: [
      {
        id: 'hi',
        heading: 'his',
        elements: [
          {
            id: 'configId2',
            label: 'ConfigId2 Label',
            type: DS.ConfigElementType.DIMENSION,
            options: {
              max: 5,
              min: 1,
              supportedTypes: [],
              options: [],
            },
          },
          {
            id: 'configId1',
            label: 'ConfigId1 Label',
            type: DS.ConfigElementType.METRIC,
            options: {
              max: 5,
              min: 1,
              supportedTypes: [],
              options: [],
            },
          },
        ],
      },
    ],
  };

  const expected: Lib.Message = {
    type: 'RENDER',
    fields: {
      configId2: [
        {
          id: 'configId2',
          concept: 'DIMENSION',
          dataStudioId: 'campaignId',
          name: 'Campaign',
          type: 'TEXT',
        },
        {
          id: 'configId2',
          concept: 'DIMENSION',
          dataStudioId: 'dateId',
          name: 'Date',
          type: 'YEAR_MONTH_DAY',
        },
      ],
      configId1: [
        {
          id: 'configId1',
          concept: 'METRIC',
          dataStudioId: 'orderWeight',
          name: 'Order Weight',
          type: 'NUMBER',
        },
        {
          id: 'configId1',
          concept: 'METRIC',
          dataStudioId: 'orderValueId',
          name: 'Order Value',
          type: 'CURRENCY_USD',
        },
      ],
    },
    rows: [
      {
        configId1: [1, 100],
        configId2: ['jan', '03-29-1992'],
        dataTag: 'primaryRow',
      },
      {
        configId1: [2, 200],
        configId2: ['feb', '03-30-1992'],
        dataTag: 'primaryRow',
      },
    ],
    style: {},
  };

  const actual = transformData(input);
  expect(actual).toEqual(expected);
});

test('transformData multiple metric config.', () => {
  const input: DS.Message = {
    type: 'RENDER',
    schema: [
      {
        name: 'campaignId',
        label: 'Campaign',
        concept: 'DIMENSION',
        dataType: 'STRING',
        semantic: 'TEXT',
      },
      {
        name: 'orderWeight',
        label: 'Order Weight',
        concept: 'METRIC',
        dataType: 'NUMBER',
        semantic: 'NUMBER',
      },
      {
        name: 'orderValueId',
        label: 'Order Value',
        concept: 'METRIC',
        dataType: 'NUMBER',
        semantic: 'CURRENCY',
        semanticOption: 'USD',
      },
    ],
    rows: {
      primaryRows: [['jan', 1, 100], ['feb', 2, 200]],
      comparisonRows: [],
    },
    style: {},
    data: [
      {
        id: 'hi',
        heading: 'his',
        elements: [
          {
            id: 'configId2',
            label: 'ConfigId2 Label',
            type: DS.ConfigElementType.DIMENSION,
            options: {
              max: 1,
              min: 1,
              supportedTypes: [],
              options: [],
            },
          },
          {
            id: 'configId1',
            label: 'ConfigId1 Label',
            type: DS.ConfigElementType.METRIC,
            options: {
              max: 2,
              min: 2,
              supportedTypes: [],
              options: [],
            },
          },
        ],
      },
    ],
  };
  const expected: Lib.Message = {
    type: 'RENDER',
    fields: {
      configId2: [
        {
          id: 'configId2',
          concept: 'DIMENSION',
          dataStudioId: 'campaignId',
          name: 'Campaign',
          type: 'TEXT',
        },
      ],
      configId1: [
        {
          id: 'configId1',
          concept: 'METRIC',
          dataStudioId: 'orderWeight',
          name: 'Order Weight',
          type: 'NUMBER',
        },
        {
          id: 'configId1',
          concept: 'METRIC',
          dataStudioId: 'orderValueId',
          name: 'Order Value',
          type: 'CURRENCY_USD',
        },
      ],
    },
    rows: [
      {
        configId1: [1, 100],
        configId2: ['jan'],
        dataTag: 'primaryRow',
      },
      {
        configId1: [2, 200],
        configId2: ['feb'],
        dataTag: 'primaryRow',
      },
    ],
    style: {},
  };

  const actual = transformData(input);
  expect(actual).toEqual(expected);
});

test('transformData too many metric groups config.', () => {
  const input: DS.Message = {
    type: 'RENDER',
    schema: [],
    rows: {
      primaryRows: [],
      comparisonRows: [],
    },
    style: {},
    data: [
      {
        id: 'hi',
        heading: 'his',
        elements: [
          {
            id: 'configId2',
            label: 'ConfigId2 Label',
            type: DS.ConfigElementType.DIMENSION,
            options: {
              max: 1,
              min: 1,
              supportedTypes: [],
              options: [],
            },
          },
          {
            id: 'configId3',
            label: 'ConfigId2 Label',
            type: DS.ConfigElementType.METRIC,
            options: {
              max: 1,
              min: 1,
              supportedTypes: [],
              options: [],
            },
          },
          {
            id: 'configId1',
            label: 'ConfigId1 Label',
            type: DS.ConfigElementType.METRIC,
            options: {
              max: 2,
              min: 2,
              supportedTypes: [],
              options: [],
            },
          },
        ],
      },
    ],
  };
  const expected: Lib.Message = {
    type: 'RENDER',
    fields: {
      configId2: [
        {
          id: 'configId2',
          concept: 'DIMENSION',
          dataStudioId: 'campaignId',
          name: 'Campaign',
          type: 'TEXT',
        },
      ],
      configId1: [
        {
          id: 'configId1',
          concept: 'METRIC',
          dataStudioId: 'orderWeight',
          name: 'Order Weight',
          type: 'NUMBER',
        },
        {
          id: 'configId1',
          concept: 'METRIC',
          dataStudioId: 'orderValueId',
          name: 'Order Value',
          type: 'CURRENCY_USD',
        },
      ],
    },
    rows: [
      {
        configId1: [1, 100],
        configId2: ['jan'],
        isComparisonRow: false,
      },
      {
        configId1: [2, 200],
        configId2: ['feb'],
        isComparisonRow: false,
      },
    ],
    style: {},
  };

  expect(() => {
    transformData(input);
  }).toThrow('one metric and one dimension');
});

test('transformData metric group first', () => {
  const input: DS.Message = {
    type: 'RENDER',
    schema: [],
    rows: {
      primaryRows: [],
      comparisonRows: [],
    },
    style: {},
    data: [
      {
        id: 'hi',
        heading: 'his',
        elements: [
          {
            id: 'configId1',
            label: 'ConfigId1 Label',
            type: DS.ConfigElementType.METRIC,
            options: {
              max: 2,
              min: 2,
              supportedTypes: [],
              options: [],
            },
          },
          {
            id: 'configId2',
            label: 'ConfigId2 Label',
            type: DS.ConfigElementType.DIMENSION,
            options: {
              max: 1,
              min: 1,
              supportedTypes: [],
              options: [],
            },
          },
        ],
      },
    ],
  };

  expect(() => {
    transformData(input);
  }).toThrow('must be a dimension');
});

test('transformData two dimensions', () => {
  const input: DS.Message = {
    type: 'RENDER',
    schema: [],
    rows: {
      primaryRows: [],
      comparisonRows: [],
    },
    style: {},
    data: [
      {
        id: 'hi',
        heading: 'his',
        elements: [
          {
            id: 'configId2',
            label: 'ConfigId2 Label',
            type: DS.ConfigElementType.DIMENSION,
            options: {
              max: 1,
              min: 1,
              supportedTypes: [],
              options: [],
            },
          },
          {
            id: 'configId2',
            label: 'ConfigId2 Label',
            type: DS.ConfigElementType.DIMENSION,
            options: {
              max: 1,
              min: 1,
              supportedTypes: [],
              options: [],
            },
          },
        ],
      },
    ],
  };

  expect(() => {
    transformData(input);
  }).toThrow('must be a metric');
});
