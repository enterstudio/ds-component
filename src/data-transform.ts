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
import * as impl from './impl';
import * as Lib from './library-types';
import * as DS from './data-studio-types';

const assoc = <T, U>(t: T, newKey: string, newVal: U) =>
  Object.assign({}, t, {[newKey]: newVal});

const zip2 = <T, U>(ts: T[], us: U[]): [T, U][] =>
  ts.map((t, idx): [T, U] => [t, us[idx]]);

const zip3 = <T, U, V>(ts: T[], us: U[], vs: V[]): [T, U, V][] =>
  ts.map((t, idx): [T, U, V] => [t, us[idx], vs[idx]]);

const repeat = <T>(n: number, val: T): T[] => {
  let ts: T[] = [];
  for (let i = 0; i < n; i++) {
    ts.push(val);
  }
  return ts;
};

export const destructImage = (value: string): Lib.ParsedImage => {
  const [originalUrl, proxiedUrl, altText] = value.split('\u00a0\u00a0');
  return {
    originalUrl,
    proxiedUrl,
    altText,
  };
};

const update = (obj, property, f) => {
  let newProp = f(obj[property]);
  return assoc(obj, property, newProp);
};

const toFieldType = (schemaEntry: DS.SchemaEntry): Lib.FieldType =>
  schemaEntry.semantic === 'CURRENCY'
    ? (('CURRENCY_' + schemaEntry.semanticOption) as Lib.FieldType)
    : schemaEntry.semantic;

const schemaEntryToField = (
  configId: string,
  schemaEntry: DS.SchemaEntry
): Lib.Field => ({
  id: configId,
  concept: schemaEntry.concept,
  dataStudioId: schemaEntry.name,
  name: schemaEntry.label,
  type: toFieldType(schemaEntry),
});

const toLibRowValue = (
  rowValue: DS.RowValue,
  schemaEntry: DS.SchemaEntry
): Lib.RowValue =>
  schemaEntry.semantic === 'IMAGE'
    ? destructImage(rowValue as string)
    : rowValue;

// we are promised that there will be one dimension group and one metric group.
// Both of these can have between 1 and 20 entries. This joins together the
// data, schema, and config values into one composite object.
export const buildFieldsAndRows = (message: DS.Message) => {
  let firstRow = message.rows.primaryRows[0];

  let flattenedElements: DS.ConfigElement[] = message.data.reduce(
    (acc: DS.ConfigElement[], configData: DS.ConfigData) => {
      return configData.elements
        .filter(
          (element: DS.ConfigElement) =>
            element.type === DS.ConfigElementType.DIMENSION ||
            element.type === DS.ConfigElementType.METRIC
        )
        .reduce((acc: DS.ConfigElement[], element: DS.ConfigElement) => {
          acc.push(element);
          return acc;
        }, []);
    },
    []
  );
  if (flattenedElements.length !== 2) {
    throw `Only configs with one metric and one dimension are supported. Your config:\n${JSON.stringify(
      message.data
    )}`;
  }
  if (flattenedElements[0].type !== DS.ConfigElementType.DIMENSION) {
    throw `Your first config element must be a dimension. Your first: ${
      flattenedElements[0]
    }`;
  }
  if (flattenedElements[1].type !== DS.ConfigElementType.METRIC) {
    throw `Your second config element must be a metric. Your first: ${
      flattenedElements[0]
    }`;
  }
  const dimensionConfig = flattenedElements[0];
  const metricConfig = flattenedElements[1];

  let schema = message.schema;
  let configs = schema.map(
    (schemaEntry: DS.SchemaEntry) =>
      schemaEntry.concept === 'DIMENSION' ? dimensionConfig : metricConfig
  );

  const fields: Lib.FieldById = zip2(schema, configs).reduce(
    (acc, [schemaEntry, config]) => {
      return update(acc, config.id, (old) => {
        const field = schemaEntryToField(config.id, schemaEntry);
        return old === undefined ? [field] : old.concat([field]);
      });
    },
    {}
  );

  const fixRow = (dataTag: string) => (row: DS.RowEntry) => {
    return zip3(row, schema, configs).reduce(
      (acc, [rowValue, schemaEntry, config]) => {
        return update(acc, config.id, (old) => {
          const val = toLibRowValue(rowValue, schemaEntry);
          return old === undefined ? [val] : old.concat([val]);
        });
      },
      {dataTag}
    );
  };

  const rows: Lib.Row[] = message.rows.comparisonRows
    .map(fixRow('comparisonRow'))
    .concat(message.rows.primaryRows.map(fixRow('primaryRow')));
  return {fields, rows};
};

export const transformData = (message: DS.Message): Lib.Message => ({
  style: message.style,
  type: message.type,
  ...buildFieldsAndRows(message),
});
