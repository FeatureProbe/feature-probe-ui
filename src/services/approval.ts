import qs from 'qs';
import request from '../utils/request';
import API from '../constants/api';
import { ApplicationJson } from 'constants/api/contentType';
import { IApprovalParams } from 'interfaces/approval';

export const getApprovalList = async<T> (params: IApprovalParams) => {
  const url = `${API.approvalRecords}?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};