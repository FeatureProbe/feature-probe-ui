import isString from 'lodash/isString';
import trim from 'lodash/trim';

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
