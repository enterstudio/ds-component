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
import * as parse from 'url-parse';
import {
  ConfigDataElement,
  ConfigDataElementType,
  Field,
  FieldId,
  FieldsById,
  FieldType,
  Message,
  MessageType,
  ParsedImage,
  ParsedRowValue,
  PostMessage,
  Row,
  RowByConfigId,
  RowValue,
  Table,
  TablesByType,
  TableType,
} from './types';

// Make all exported types available to external users.
export * from './types';

/**
 * Returns the width (in pixels) of the vis's iframe.
 *
 * Usage:
 * ```
 * var myWidth = dscc.getWidth();
 * console.log('My width is: ', myWidth);
 * ```
 */
export const getWidth = (): number => document.body.clientWidth;

/**
 * Returns the height (in pixels) of the vis's iframe.
 *
 * Usage:
 * ```
 * var myHeight = dscc.getHeight();
 * console.log('My height is: ', myHeight);
 * ```
 */
export const getHeight = (): number => document.documentElement.clientHeight;

/**
 * Returns the componentId of the vis. Component ids uniquely identify a vis to
 * Data Studio, and are sent with `postMessage`s to let Data Studio know which
 * vis sent data.
 *
 * Usage:
 * ```
 * var myComponentId = dscc.getComponentId();
 * console.log('My componentId is: ', myComponentId);
 * ```
 */
const getComponentId = (): string => {
  const parsed = parse(window.parent.location.href, true);
  return parsed.query.componentId;
};

/**
 * Parses a `'\u00a0\u00a0'` delimited string into component parts. If any parts
 * are missing, they will be returned as undefined.
 *
 * Usage:
 * ```
 * const myImage = parseImage('originalurl.com\u00a0\u00a0proxiedurl.com\u00a0\u00a0alt text');
 *
 * expect(myImage).toEqual({
 *   originalUrl: 'originalurl.com',
 *   proxiedUrl: 'proxiedurl.com',
 *   altText: 'alt text',
 * });
 * ```
 */
export const parseImage = (value: string): ParsedImage => {
  const [originalUrl, proxiedUrl, altText] = value.split('\u00a0\u00a0');
  return {
    altText,
    originalUrl,
    proxiedUrl,
  };
};

/**
 * Returns the fields indexed by their Data Studio id. This is useful if you
 * have to lookups many fields so you don't have to do a full search every time.
 *
 * Usage:
 * ```
 * dscc.subscribeToData(function(message) {
 *   var fieldsByDSId = dscc.fieldsByDSId(message);
 *   var field1 = fieldsByDSId['field1Id'];
 *   var field2 = fieldsByDSId['field2Id'];
 * });
 * ```
 */
export const fieldsById = (message: Message): FieldsById =>
  message.fields.reduce((acc: FieldsById, field: Field) => {
    acc[field.id] = field;
    return acc;
  }, {});

const zip2 = <T, U>(t: T[], u: U[]): Array<[T, U]> => {
  if (t.length < u.length) {
    return t.map((tEntry: T, idx: number): [T, U] => [tEntry, u[idx]]);
  } else {
    return u.map((uEntry: U, idx: number): [T, U] => [t[idx], uEntry]);
  }
};

interface RowById {
  [fieldId: string]: ParsedRowValue;
}

const toRowById = (
  indexFields: FieldsById,
  row: Row,
  fields: FieldId[]
): RowById => {
  const matched = zip2(fields, row);
  return matched.reduce(
    (acc: RowById, [fieldId, rowValue]: [FieldId, RowValue]) => {
      const field: Field = indexFields[fieldId];
      const xformedValue =
        field.type === FieldType.IMAGE
          ? parseImage(rowValue as string)
          : rowValue;
      acc[fieldId] = xformedValue;
      return acc;
    },
    {}
  );
};

const toRowByConfigId = (
  message: Message,
  indexedFields: FieldsById,
  fieldIds: FieldId[],
  row: Row
): RowByConfigId => {
  const fieldRow: RowById = toRowById(indexedFields, row, fieldIds);
  const dataFields = message.config.data.reduce((acc, data) => {
    return acc.concat(data.elements);
  }, []);
  const concepts = dataFields.filter(dimensionOrMetric);
  return concepts.reduce(
    (rowObjects: RowByConfigId, element: ConfigDataElement) => {
      const rowData = element.value.map(
        (fieldId: FieldId) => fieldRow[fieldId]
      );
      rowObjects[element.id] = rowData;
      return rowObjects;
    },
    {}
  );
};

const dimensionOrMetric = (element: ConfigDataElement): boolean =>
  element.type === ConfigDataElementType.DIMENSION ||
  element.type === ConfigDataElementType.METRIC;

/**
 * Returns all tables, with row values indexed by their configId.
 *
 * Usage:
 * ```
 * dscc.subscribeToData(function(message) {
 *   var rowsById = dscc.rowsByConfigId(message);
 *   console.log('rowsById', rowsById);
 * })
 * ```
 */
export const rowsByConfigId = (message: Message): TablesByType => {
  const indexFields = fieldsById(message);
  const thing: TablesByType = {
    [TableType.COMPARISON]: [],
    [TableType.DEFAULT]: [],
    [TableType.SUMMARY]: [],
  };
  return message.dataResponse.tables.reduce(
    (acc: TablesByType, table: Table) => {
      const tableData: RowByConfigId[] = table.rows.map((row) =>
        toRowByConfigId(message, indexFields, table.fields, row)
      );
      acc[table.id] = tableData;
      return acc;
    },
    {
      [TableType.COMPARISON]: [],
      [TableType.DEFAULT]: [],
      [TableType.SUMMARY]: [],
    }
  );
};

/**
 * Subscribes to messages from Data Studio. Calls `cb` for every new
 * [[MessageType.RENDER]] message. Returns a function that will unsubscribe
 * `callback` from further invocations.
 *
 * Usage:
 * ```
 * var unsubscribe = dscc.subscribeToData(function(message) {
 *   console.log(message.fields)
 *   console.log(message.config)
 *   console.log(message.dataResponse)
 * });
 *
 * setTimeout(function() {
 *   unsubscribe();
 * }, 3000)
 * ```
 */
export const subscribeToData = (
  cb: (componentData: Message) => void
): (() => void) => {
  const onMessage = (message: PostMessage) => {
    if (message.data.type === MessageType.RENDER) {
      cb(message.data);
    } else {
      console.error(
        `MessageType: ${
          message.data.type
        } is not supported by this version of the library.`
      );
    }
  };
  window.addEventListener('message', onMessage);
  const componentId = getComponentId();
  // Tell DataStudio that the viz is ready to get events.
  window.parent.postMessage({componentId, type: 'vizReady'}, '*');
  return () => window.removeEventListener('message', onMessage);
};
