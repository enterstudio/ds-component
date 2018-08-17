export interface PostMessage extends MessageEvent {
  data: Message;
}

export interface Message {
  type: MessageType;
  rows: Rows;
  schema: Schema;
  data: ConfigData[];
  // Might expose style later. Should properly define this type if I do.
  style: any;
}

export interface ConfigData {
  id: string;
  heading: string;
  elements: ConfigElement[];
}

export enum ConfigElementType {
  DIMENSION = 1,
  METRIC = 2,
  MAX_RESULTS = 3,
}

export interface ConfigElement {
  id: string;
  label: string;
  type: ConfigElementType;
  options: ConceptOption | MaxResultsOption;
}

export interface ConceptOption {
  min: number;
  max: number;
  supportedTypes: SemanticType[];
  // what can this ever be?
  options: any[];
}

export interface MaxResultsOption {
  value: number;
  // I don't think this makes any sense.
  supportedTypes: SemanticType[];
  // what can this ever be?
  options: any[];
}

export type Schema = SchemaEntry[];

export type MessageType = 'RENDER';

export type RowValue = string | number;

export type RowEntry = RowValue[];

export interface Rows {
  primaryRows: RowEntry[];
  comparisonRows: RowEntry[];
}

export interface StyleFont {
  color: string;
}

export type StyleEntry = boolean | number | string | StyleFont;

export interface Style {
  [styleKey: string]: StyleEntry;
}

export interface SchemaEntry {
  name: string;
  label: string;
  concept: Concept;
  dataType: DataType;
  semantic: SemanticType;
  semanticOption?: SemanticOption;
}

export type Concept = 'METRIC' | 'DIMENSION';

export type DataType = 'STRING' | 'NUMBER' | 'BOOLEAN';

export type SemanticType =
  | 'YEAR'
  | 'YEAR_QUARTER'
  | 'YEAR_MONTH'
  | 'YEAR_WEEK'
  | 'YEAR_MONTH_DAY'
  | 'YEAR_MONTH_DAY_HOUR'
  | 'QUARTER'
  | 'MONTH'
  | 'WEEK'
  | 'MONTH_DAY'
  | 'DAY_OF_WEEK'
  | 'DAY'
  | 'HOUR'
  | 'MINUTE'
  | 'DURATION'
  | 'COUNTRY'
  | 'COUNTRY_CODE'
  | 'CONTINENT'
  | 'CONTINENT_CODE'
  | 'SUB_CONTINENT'
  | 'SUB_CONTINENT_CODE'
  | 'REGION'
  | 'REGION_CODE'
  | 'CITY'
  | 'CITY_CODE'
  | 'METRO_CODE'
  | 'LATITUDE_LONGITUDE'
  | 'NUMBER'
  | 'PERCENT'
  | 'TEXT'
  | 'BOOLEAN'
  | 'URL'
  | 'IMAGE'
  | 'CURRENCY';

export type SemanticOption =
  | 'AED'
  | 'ALL'
  | 'ARS'
  | 'AUD'
  | 'BDT'
  | 'BGN'
  | 'BOB'
  | 'BRL'
  | 'CAD'
  | 'CDF'
  | 'CHF'
  | 'CLP'
  | 'CNY'
  | 'COP'
  | 'CRC'
  | 'CZK'
  | 'DKK'
  | 'DOP'
  | 'EGP'
  | 'ETB'
  | 'EUR'
  | 'GBP'
  | 'HKD'
  | 'HRK'
  | 'HUF'
  | 'IDR'
  | 'ILS'
  | 'INR'
  | 'IRR'
  | 'ISK'
  | 'JMD'
  | 'JPY'
  | 'KRW'
  | 'LKR'
  | 'LTL'
  | 'MNT'
  | 'MVR'
  | 'MXN'
  | 'MYR'
  | 'NOK'
  | 'NZD'
  | 'PAB'
  | 'PEN'
  | 'PHP'
  | 'PKR'
  | 'PLN'
  | 'RON'
  | 'RSD'
  | 'RUB'
  | 'SAR'
  | 'SEK'
  | 'SGD'
  | 'THB'
  | 'TRY'
  | 'TWD'
  | 'TZS'
  | 'UAH'
  | 'USD'
  | 'UYU'
  | 'VEF'
  | 'VND'
  | 'YER'
  | 'ZAR';
