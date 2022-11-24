import request from '../utils/request';
import API from '../constants/api';
import { ApplicationJson } from 'constants/api/contentType';
import { IWebHookInfo, IWebHookParam } from 'interfaces/webhook';

export const getProjectList = async <T>() => {
  const url = API.getProjectListURI;

  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson(),
    },
  });
};

export const getWebHookList = async <T>() => {
  const url = API.getWebHookListURI;

  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson(),
    },
  });
};

export const createWebHook = async <T>(data: IWebHookInfo) => {
  const url = API.createWebHookURI;

  return request<T>(url, {
    method: 'POST',
    headers: {
      ...ApplicationJson(),
    },
    body: JSON.stringify(data),
  });
};

export const queryWebHook = async <T>(id: string) => {
  const url = API.queryWebHookURI.replace(':id', id);

  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson(),
    },
  });
};

export const updateWebHook = async <T>(id: string, data: IWebHookParam) => {
  const url = API.updateWebHookURI.replace(':id', id);

  return request<T>(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson(),
    },
    body: JSON.stringify(data),
  });
};

export const deleteWebHook = async <T>(id: string) => {
  const url = API.deleteWebHookURI.replace(':id', id);

  return request<T>(url, {
    method: 'DELETE',
    headers: {
      ...ApplicationJson(),
    },
  });
};
