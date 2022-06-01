import request from '../utils/request';
import API from '../constants/api';
import { ApplicationJsonContentType } from 'constants/api/contentType';

interface ILoginParams {
  account: string;
  password: string;
}

export const getUserInfo = async<T> () => {
  const url = API.userInfoURI;
  
  return request<T>(url);
};

export const login = async (data: ILoginParams) => {
  const url = `${API.loginURI}`;
  
  return request(url, {
    method: 'POST',
    headers: {
      ...ApplicationJsonContentType()
    },
    body: JSON.stringify(data),
  });
}

export const logout = async<T> () => {
  const url = API.logoutURI;
  
  return request<T>(url);
};
