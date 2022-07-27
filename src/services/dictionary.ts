import request from '../utils/request';
import API from '../constants/api';
import { ApplicationJsonContentType } from 'constants/api/contentType';

export const getFromDictionary = async<T> (key: string) => {
  const url = `${
    API.dictionaryURI
    .replace(':key', key)
  }`;
  
  return request<T>(url);
};

export const saveDictionary = async (key: string, data: any) => {
  const url = `${
    API.dictionaryURI
    .replace(':key', key)
  }`;
  
  return request(url, {
    method: 'POST',
    headers: {
      ...ApplicationJsonContentType()
    },
    body: JSON.stringify(data),
  });
};