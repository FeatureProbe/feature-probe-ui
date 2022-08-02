import request from "../utils/request";
import API from '../constants/api';

export const getSdkVersion = async <T>(key: string) => {
    const url = `${
        API.sdkVersionURI
            .replace(':key', key)
    }`;

  return request<T>(url);
};
