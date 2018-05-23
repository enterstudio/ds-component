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

const destructImage = (value: string): impl.ParsedImage => {
  const [originalUrl, proxiedUrl, altText] = value.split('\u00a0\u00a0');
  return {
    originalUrl,
    proxiedUrl,
    altText,
  };
};

const transformRowsHelper = (
  isComparisonRow: boolean,
  rows: (string | number)[][],
  schema: impl.DSSchema[]
): impl.Row[] => {
  return rows.map((row) => {
    let newRow: impl.Row = {isComparisonRow};
    for (let i = 0; i < row.length; i++) {
      const schemaField = schema[i];
      const column =
        schemaField.semantic === impl.SchemaSemanticType.IMAGE
          ? // We know that the row is a string if the type is IMAGE.
            destructImage(row[i] as string)
          : row[i];
      newRow[schemaField.name] = column;
    }
    return newRow;
  });
};

const transformRows = (
  rows: impl.DSRows,
  schema: impl.DSSchema[]
): impl.Row[] => {
  const comparisonRows = transformRowsHelper(true, rows.comparisonRows, schema);
  const primaryRows = transformRowsHelper(false, rows.primaryRows, schema);
  return comparisonRows.concat(primaryRows);
};

// TODO(mjhamrick) - there is probably a cleaner way to do this.
const toFieldType = (schemaEntry: impl.DSSchema): impl.FieldType => {
  if (schemaEntry.semantic === impl.SchemaSemanticType.CURRENCY) {
    const fieldType: string =
      impl.SchemaSemanticType[schemaEntry.semantic] +
      '_' +
      impl.SchemaSemanticOption[schemaEntry.semanticOption];
    return impl.FieldType[fieldType];
  } else {
    return impl.FieldType[impl.SchemaSemanticType[schemaEntry.semantic]];
  }
};

const schemaToField = (schemaEntry: impl.DSSchema): impl.Field => {
  return {
    concept: schemaEntry.concept,
    id: schemaEntry.name,
    name: schemaEntry.label,
    type: toFieldType(schemaEntry),
  };
};

const transformSchema = (schema: impl.DSSchema[]): impl.FieldById => {
  let fields = {};
  schema.forEach((schemaEntry) => {
    fields[schemaEntry.name] = schemaToField(schemaEntry);
  });
  return fields;
};

export const transformData = (
  receiveMessage: impl.DSMessage
): impl.ComponentData => {
  const joinedRows: impl.ComponentData = {
    style: receiveMessage.data.style,
    type: receiveMessage.data.type,
    fieldById: transformSchema(receiveMessage.data.schema),
    fields: receiveMessage.data.schema.map(schemaToField),
    rows: transformRows(receiveMessage.data.rows, receiveMessage.data.schema),
  };
  return joinedRows;
};
