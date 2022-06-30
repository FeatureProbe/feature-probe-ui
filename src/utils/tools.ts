import isString from 'lodash/isString';
import trim from 'lodash/trim';
import { IVariation } from 'interfaces/targeting';

export const replaceSpace = (obj: any) => {
  for (let k in obj) {
    if (obj[k] && isString(obj[k])) {
      obj[k] = trim(obj[k]);
    }
  }

  return obj;
}

export const isJSON = (str: string) => {
  try {
    if (JSON.parse(str) instanceof Object) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

export const getVariationName = (variations: IVariation[]) => {
  let name = '';
  for (let i = 1; i <= 20; i++) {
    const index = variations.findIndex((variation) => {
      return variation.name === 'variation' + i;
    });
    if (index === -1) {
      name = 'variation' + i;
      break;
    }
  }
  return name;
}
