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
import {transformData} from './data-transform';
import * as parse from 'url-parse';
// TODO(mjhamrick) - use yarn link so this can work locally, and put a little
// something in some docs so I can remember how this works later.

// Messages From Data Studio
export enum MessageType {
  RENDER = 'RENDER',
}

export interface DSRows {
  primaryRows: (string | number)[][];
  comparisonRows: (string | number)[][];
}

export enum ConceptType {
  Metric = 'METRIC',
  Dimension = 'DIMENSION',
}

export enum SchemaDataType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
}

export enum SchemaSemanticType {
  YEAR = 'YEAR',
  YEAR_QUARTER = 'YEAR_QUARTER',
  YEAR_MONTH = 'YEAR_MONTH',
  YEAR_WEEK = 'YEAR_WEEK',
  YEAR_MONTH_DAY = 'YEAR_MONTH_DAY',
  YEAR_MONTH_DAY_HOUR = 'YEAR_MONTH_DAY_HOUR',
  QUARTER = 'QUARTER',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  MONTH_DAY = 'MONTH_DAY',
  DAY_OF_WEEK = 'DAY_OF_WEEK',
  DAY = 'DAY',
  HOUR = 'HOUR',
  MINUTE = 'MINUTE',
  DURATION = 'DURATION',
  COUNTRY = 'COUNTRY',
  COUNTRY_CODE = 'COUNTRY_CODE',
  CONTINENT = 'CONTINENT',
  CONTINENT_CODE = 'CONTINENT_CODE',
  SUB_CONTINENT = 'SUB_CONTINENT',
  SUB_CONTINENT_CODE = 'SUB_CONTINENT_CODE',
  REGION = 'REGION',
  REGION_CODE = 'REGION_CODE',
  CITY = 'CITY',
  CITY_CODE = 'CITY_CODE',
  METRO_CODE = 'METRO_CODE',
  LATITUDE_LONGITUDE = 'LATITUDE_LONGITUDE',
  NUMBER = 'NUMBER',
  PERCENT = 'PERCENT',
  TEXT = 'TEXT',
  BOOLEAN = 'BOOLEAN',
  URL = 'URL',
  IMAGE = 'IMAGE',
  CURRENCY = 'CURRENCY',
}

export enum SchemaSemanticOption {
  AED = 'AED',
  ALL = 'ALL',
  ARS = 'ARS',
  AUD = 'AUD',
  BDT = 'BDT',
  BGN = 'BGN',
  BOB = 'BOB',
  BRL = 'BRL',
  CAD = 'CAD',
  CDF = 'CDF',
  CHF = 'CHF',
  CLP = 'CLP',
  CNY = 'CNY',
  COP = 'COP',
  CRC = 'CRC',
  CZK = 'CZK',
  DKK = 'DKK',
  DOP = 'DOP',
  EGP = 'EGP',
  ETB = 'ETB',
  EUR = 'EUR',
  GBP = 'GBP',
  HKD = 'HKD',
  HRK = 'HRK',
  HUF = 'HUF',
  IDR = 'IDR',
  ILS = 'ILS',
  INR = 'INR',
  IRR = 'IRR',
  ISK = 'ISK',
  JMD = 'JMD',
  JPY = 'JPY',
  KRW = 'KRW',
  LKR = 'LKR',
  LTL = 'LTL',
  MNT = 'MNT',
  MVR = 'MVR',
  MXN = 'MXN',
  MYR = 'MYR',
  NOK = 'NOK',
  NZD = 'NZD',
  PAB = 'PAB',
  PEN = 'PEN',
  PHP = 'PHP',
  PKR = 'PKR',
  PLN = 'PLN',
  RON = 'RON',
  RSD = 'RSD',
  RUB = 'RUB',
  SAR = 'SAR',
  SEK = 'SEK',
  SGD = 'SGD',
  THB = 'THB',
  TRY = 'TRY',
  TWD = 'TWD',
  TZS = 'TZS',
  UAH = 'UAH',
  USD = 'USD',
  UYU = 'UYU',
  VEF = 'VEF',
  VND = 'VND',
  YER = 'YER',
  ZAR = 'ZAR',
}

export interface DSSchema {
  name: string;
  label: string;
  concept: ConceptType;
  dataType: SchemaDataType;
  semantic: SchemaSemanticType;
  semanticOption?: SchemaSemanticOption;
}

export interface DSMessageData {
  type: MessageType;
  rows: DSRows;
  style: any;
  schema: DSSchema[];
}

export interface DSMessage extends MessageEvent {
  data: DSMessageData;
}

// Messages To/From Client
export interface IsComparisonRow {
  isComparisonRow?: boolean;
}

export interface ParsedImage {
  originalUrl: string;
  proxiedUrl: string;
  altText: string;
}

export type RowData = {
  [key: string]: boolean | number | string | ParsedImage;
};

export type Row = IsComparisonRow & RowData;

export interface Style {
  [styleKey: string]: boolean | number | string;
}

export interface FieldById {
  [fieldId: string]: Field;
}

export interface ComponentData {
  rows: Row[];
  type: MessageType;
  fieldById: FieldById;
  fields: Field[];
  style: Style;
}

export enum FieldType {
  YEAR = 'YEAR',
  YEAR_QUARTER = 'YEAR_QUARTER',
  YEAR_MONTH = 'YEAR_MONTH',
  YEAR_WEEK = 'YEAR_WEEK',
  YEAR_MONTH_DAY = 'YEAR_MONTH_DAY',
  YEAR_MONTH_DAY_HOUR = 'YEAR_MONTH_DAY_HOUR',
  QUARTER = 'QUARTER',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  MONTH_DAY = 'MONTH_DAY',
  DAY_OF_WEEK = 'DAY_OF_WEEK',
  DAY = 'DAY',
  HOUR = 'HOUR',
  MINUTE = 'MINUTE',
  DURATION = 'DURATION',
  COUNTRY = 'COUNTRY',
  COUNTRY_CODE = 'COUNTRY_CODE',
  CONTINENT = 'CONTINENT',
  CONTINENT_CODE = 'CONTINENT_CODE',
  SUB_CONTINENT = 'SUB_CONTINENT',
  SUB_CONTINENT_CODE = 'SUB_CONTINENT_CODE',
  REGION = 'REGION',
  REGION_CODE = 'REGION_CODE',
  CITY = 'CITY',
  CITY_CODE = 'CITY_CODE',
  METRO_CODE = 'METRO_CODE',
  LATITUDE_LONGITUDE = 'LATITUDE_LONGITUDE',
  NUMBER = 'NUMBER',
  PERCENT = 'PERCENT',
  TEXT = 'TEXT',
  BOOLEAN = 'BOOLEAN',
  URL = 'URL',
  IMAGE = 'IMAGE',
  CURRENCY_AED = 'CURRENCY_AED',
  CURRENCY_ALL = 'CURRENCY_ALL',
  CURRENCY_ARS = 'CURRENCY_ARS',
  CURRENCY_AUD = 'CURRENCY_AUD',
  CURRENCY_BDT = 'CURRENCY_BDT',
  CURRENCY_BGN = 'CURRENCY_BGN',
  CURRENCY_BOB = 'CURRENCY_BOB',
  CURRENCY_BRL = 'CURRENCY_BRL',
  CURRENCY_CAD = 'CURRENCY_CAD',
  CURRENCY_CDF = 'CURRENCY_CDF',
  CURRENCY_CHF = 'CURRENCY_CHF',
  CURRENCY_CLP = 'CURRENCY_CLP',
  CURRENCY_CNY = 'CURRENCY_CNY',
  CURRENCY_COP = 'CURRENCY_COP',
  CURRENCY_CRC = 'CURRENCY_CRC',
  CURRENCY_CZK = 'CURRENCY_CZK',
  CURRENCY_DKK = 'CURRENCY_DKK',
  CURRENCY_DOP = 'CURRENCY_DOP',
  CURRENCY_EGP = 'CURRENCY_EGP',
  CURRENCY_ETB = 'CURRENCY_ETB',
  CURRENCY_EUR = 'CURRENCY_EUR',
  CURRENCY_GBP = 'CURRENCY_GBP',
  CURRENCY_HKD = 'CURRENCY_HKD',
  CURRENCY_HRK = 'CURRENCY_HRK',
  CURRENCY_HUF = 'CURRENCY_HUF',
  CURRENCY_IDR = 'CURRENCY_IDR',
  CURRENCY_ILS = 'CURRENCY_ILS',
  CURRENCY_INR = 'CURRENCY_INR',
  CURRENCY_IRR = 'CURRENCY_IRR',
  CURRENCY_ISK = 'CURRENCY_ISK',
  CURRENCY_JMD = 'CURRENCY_JMD',
  CURRENCY_JPY = 'CURRENCY_JPY',
  CURRENCY_KRW = 'CURRENCY_KRW',
  CURRENCY_LKR = 'CURRENCY_LKR',
  CURRENCY_LTL = 'CURRENCY_LTL',
  CURRENCY_MNT = 'CURRENCY_MNT',
  CURRENCY_MVR = 'CURRENCY_MVR',
  CURRENCY_MXN = 'CURRENCY_MXN',
  CURRENCY_MYR = 'CURRENCY_MYR',
  CURRENCY_NOK = 'CURRENCY_NOK',
  CURRENCY_NZD = 'CURRENCY_NZD',
  CURRENCY_PAB = 'CURRENCY_PAB',
  CURRENCY_PEN = 'CURRENCY_PEN',
  CURRENCY_PHP = 'CURRENCY_PHP',
  CURRENCY_PKR = 'CURRENCY_PKR',
  CURRENCY_PLN = 'CURRENCY_PLN',
  CURRENCY_RON = 'CURRENCY_RON',
  CURRENCY_RSD = 'CURRENCY_RSD',
  CURRENCY_RUB = 'CURRENCY_RUB',
  CURRENCY_SAR = 'CURRENCY_SAR',
  CURRENCY_SEK = 'CURRENCY_SEK',
  CURRENCY_SGD = 'CURRENCY_SGD',
  CURRENCY_THB = 'CURRENCY_THB',
  CURRENCY_TRY = 'CURRENCY_TRY',
  CURRENCY_TWD = 'CURRENCY_TWD',
  CURRENCY_TZS = 'CURRENCY_TZS',
  CURRENCY_UAH = 'CURRENCY_UAH',
  CURRENCY_USD = 'CURRENCY_USD',
  CURRENCY_UYU = 'CURRENCY_UYU',
  CURRENCY_VEF = 'CURRENCY_VEF',
  CURRENCY_VND = 'CURRENCY_VND',
  CURRENCY_YER = 'CURRENCY_YER',
  CURRENCY_ZAR = 'CURRENCY_ZAR',
}

export interface Field {
  id: string;
  concept: ConceptType;
  name: string;
  type: FieldType;
}

export enum ClientMessageType {
  VIZ_READY = 'vizReady',
}

export interface ClientMessage {
  componentId: string;
  type: ClientMessageType;
  data?: {};
}

export const timeout = async (millis: number): Promise<{}> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(millis), millis);
  });
};

export const iframeLoaded = async (): Promise<{}> => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', (e) => {
      resolve(e);
    });
  });
};

export const postMessage = (clientMessage: ClientMessage) => {
  window.parent.postMessage(clientMessage, '*');
};

export const getWidth = (): number => document.body.clientWidth;
export const getHeight = (): number => document.documentElement.clientHeight;

export const getComponentId = (): string => {
  const parsed = parse(window.parent.location.href, true);
  return parsed.query.componentId;
};

export const delayedMessage = async (
  clientMessage: ClientMessage,
  millis: number
) => {
  await iframeLoaded();
  await timeout(millis);
  postMessage(clientMessage);
};

export const subscribeToData = async (
  callback: (componentData: ComponentData) => void
): Promise<() => void> => {
  await iframeLoaded();
  const onMessage = (message: DSMessage) => {
    if (message.data.type === 'RENDER') {
      const xformed = transformData(message);
      callback(xformed);
    }
  };
  window.addEventListener('message', onMessage);
  const componentId = getComponentId();
  postMessage({componentId, type: ClientMessageType.VIZ_READY});
  // Return a function that can be used to unsubscribe to the data stream.
  return () => window.removeEventListener('message', onMessage);
};
