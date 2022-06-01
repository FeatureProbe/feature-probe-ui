import qs from 'qs';
import request from '../utils/request';
import API from '../constants/api';
import { IToggle } from 'interfaces/toggle';
import { ITag, IToggleParams } from 'interfaces/project';
import { IContent, IMetricParams } from 'interfaces/targeting';
import { ApplicationJsonContentType } from 'constants/api/contentType';

export const getToggleList = async<T> (projectKey: string, params: IToggleParams) => {
  const url = `${
    API.getToggleListURI
      .replace(':projectKey', projectKey)
  }?${qs.stringify(params)}`;
  
  return request<T>(url);
}

export const getToggleInfo = async<T> (projectKey: string, environmentKey: string, toggleKey: string) => {
  const url = `${
    API.getToggleInfoURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
  }`;
  
  return request<T>(url);
};

export const getTargeting = async<T> (projectKey: string, environmentKey: string, toggleKey: string) => {
  const url = `${
    API.targetingURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
  }`;
  return request<T>(url);
};

export const saveToggle = async (projectKey: string, environmentKey: string, toggleKey: string, data: IContent) => {
  const url = `${
    API.targetingURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
  }`;

  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJsonContentType()
    },
    body: JSON.stringify(data),
  });
}

export const createToggle = async (projectKey: string, data: IToggle) => {
  const url = `${
    API.createToggleURI
      .replace(':projectKey', projectKey)
  }`;

  return request(url, {
    method: 'POST',
    headers: {
      ...ApplicationJsonContentType()
    },
    body: JSON.stringify(data),
  });
}

export const editToggle = async (projectKey: string, toggleKey: string, data: IToggle) => {
  const url = `${
    API.editToggleURI
      .replace(':projectKey', projectKey)
      .replace(':toggleKey', toggleKey)
  }`;

  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJsonContentType()
    },
    body: JSON.stringify(data),
  });
}

export const getTags = async<T> (projectKey: string) => {
  const url = `${
    API.tagsURI
      .replace(':projectKey', projectKey)
  }`;
  
  return request<T>(url);
}

export const addTag = async (projectKey: string, data: ITag) => {
  const url = `${
    API.tagsURI
      .replace(':projectKey', projectKey)
  }`;
  
  return request(url, {
    method: 'POST',
    headers: {
      ...ApplicationJsonContentType()
    },
    body: JSON.stringify(data),
  });
}

export const getMetrics = async<T> (projectKey: string, environmentKey: string, toggleKey: string, params: IMetricParams) => {
  const url = `${
    API.merticsURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
  }?${qs.stringify(params)}`;
  return request<T>(url);
};

