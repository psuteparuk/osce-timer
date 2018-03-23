export {
  assign,
  forEach,
  isNil,
  keys,
  mapValues,
  toNumber,
} from 'lodash/fp';

import {
  mapValues,
} from 'lodash/fp';
export const mapValuesWithKey = mapValues.convert({ cap: false });
