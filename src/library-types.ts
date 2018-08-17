// The message that a component sends to data studio through `postMessage`. This
// is only mechanism through which a component can communicate with Data Studio
export interface ClientMessage {
  componentId: string;
  type: ClientMessageType;
  data?: {};
}

// The types that Data Studio can respond to.
export type ClientMessageType = 'vizReady';

// Marker interface for custom transforms to return.
export interface TransformedMessage {}

// The data that ds-component gives in the subscribeToData callback.
export interface Message extends TransformedMessage {
  type: MessageType;
  rows: Row[];
  fields: FieldById;
  style: Style;
}

// The types that Data Studio can send to a component.
export type MessageType = 'RENDER';

// An individual row of component data.
export type Row = RowData;

// A view of the Fields by its PropertyConfig id.
export interface FieldById {
  [fieldId: string]: Field[];
}

// The meta-data about an individual column in a Row.
export interface Field {
  id: string;
  dataStudioId: string;
  concept: ConceptType;
  name: string;
  type: FieldType;
}

export interface StyleFont {
  color: string;
}

export type StyleEntry = boolean | number | string | StyleFont;

export interface Style {
  [styleKey: string]: StyleEntry;
}

export type RowValue = boolean | number | string | ParsedImage;

// A single row of data. It is keyed by its PropertyConfig id, then its index
// in the property config.
export type RowData = {
  // If the value is a string, then it is the table name.
  [configId: string]: RowValue[] | string;
};

type ConceptType = 'METRIC' | 'DIMENSION';

export interface ParsedImage {
  originalUrl: string;
  proxiedUrl: string;
  altText: string;
}

export type FieldType =
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
  | 'CURRENCY_AED'
  | 'CURRENCY_ALL'
  | 'CURRENCY_ARS'
  | 'CURRENCY_AUD'
  | 'CURRENCY_BDT'
  | 'CURRENCY_BGN'
  | 'CURRENCY_BOB'
  | 'CURRENCY_BRL'
  | 'CURRENCY_CAD'
  | 'CURRENCY_CDF'
  | 'CURRENCY_CHF'
  | 'CURRENCY_CLP'
  | 'CURRENCY_CNY'
  | 'CURRENCY_COP'
  | 'CURRENCY_CRC'
  | 'CURRENCY_CZK'
  | 'CURRENCY_DKK'
  | 'CURRENCY_DOP'
  | 'CURRENCY_EGP'
  | 'CURRENCY_ETB'
  | 'CURRENCY_EUR'
  | 'CURRENCY_GBP'
  | 'CURRENCY_HKD'
  | 'CURRENCY_HRK'
  | 'CURRENCY_HUF'
  | 'CURRENCY_IDR'
  | 'CURRENCY_ILS'
  | 'CURRENCY_INR'
  | 'CURRENCY_IRR'
  | 'CURRENCY_ISK'
  | 'CURRENCY_JMD'
  | 'CURRENCY_JPY'
  | 'CURRENCY_KRW'
  | 'CURRENCY_LKR'
  | 'CURRENCY_LTL'
  | 'CURRENCY_MNT'
  | 'CURRENCY_MVR'
  | 'CURRENCY_MXN'
  | 'CURRENCY_MYR'
  | 'CURRENCY_NOK'
  | 'CURRENCY_NZD'
  | 'CURRENCY_PAB'
  | 'CURRENCY_PEN'
  | 'CURRENCY_PHP'
  | 'CURRENCY_PKR'
  | 'CURRENCY_PLN'
  | 'CURRENCY_RON'
  | 'CURRENCY_RSD'
  | 'CURRENCY_RUB'
  | 'CURRENCY_SAR'
  | 'CURRENCY_SEK'
  | 'CURRENCY_SGD'
  | 'CURRENCY_THB'
  | 'CURRENCY_TRY'
  | 'CURRENCY_TWD'
  | 'CURRENCY_TZS'
  | 'CURRENCY_UAH'
  | 'CURRENCY_USD'
  | 'CURRENCY_UYU'
  | 'CURRENCY_VEF'
  | 'CURRENCY_VND'
  | 'CURRENCY_YER'
  | 'CURRENCY_ZAR';
