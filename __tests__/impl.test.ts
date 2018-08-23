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
import {iframeLoaded, subscribeToData} from '../src/impl';
import * as DS from '../src/data-studio-types';

const DEPLOYMENT_ID = 'my deployment id';

const testMessageRows = {
  primaryRows: [['(not set)', 196.5149696290909], ['feb', 0]],
  comparisonRows: [['(not set)', 198.2720811099253], ['feb', null]],
};

const testPropertyConfig: DS.ConfigData[] = [
  {
    id: 'hi',
    heading: 'his',
    elements: [
      {
        id: 'firstId',
        label: 'label for first one',
        type: DS.ConfigElementType.DIMENSION,
        options: {
          max: 1,
          min: 1,
          supportedTypes: [],
          options: [],
        },
      },
      {
        id: 'thirdId',
        label: 'label for first one',
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
];

const testMessageSchema: DS.Schema = [
  {
    name: 'c_id',
    label: 'Campaign',
    concept: 'DIMENSION',
    dataType: 'STRING',
    semantic: 'TEXT',
  },
  {
    name: 'a_id',
    label: 'Avg. Order Value',
    concept: 'METRIC',
    dataType: 'NUMBER',
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

const testMessageData: DS.Message = {
  type: 'RENDER',
  rows: testMessageRows,
  schema: testMessageSchema,
  style: testMessageStyle,
  data: testPropertyConfig,
};

const testMessage = {
  data: testMessageData,
};

beforeEach(() => {
  const addEventListenerMock = jest.fn((event, cb) => {
    if (event === 'message') {
      cb(testMessage);
    } else {
      throw new Error('unsupported event type for testing');
    }
  });

  const postMessageMock = jest.fn();
  const removeEventListenerMock = jest.fn();

  window.addEventListener = addEventListenerMock;
  window.parent.postMessage = postMessageMock;
  window.removeEventListener = removeEventListenerMock;
});

test('subscribeToData default transform works', async () => {
  const unSub = await subscribeToData((actual) => {
    expect(actual).not.toHaveProperty('data.rows.comparisonRows');
    expect(actual).toHaveProperty('rows');
  });
  unSub();
  expect(window.removeEventListener.mock.calls.length).toBeGreaterThan(0);
});

test('subscribeToData no transform works', async () => {
  const unSub = await subscribeToData(
    (actual) => {
      expect(actual).toHaveProperty('rows.comparisonRows');
    },
    {transform: (a) => a}
  );
  unSub();
  expect(window.removeEventListener.mock.calls.length).toBeGreaterThan(0);
});
