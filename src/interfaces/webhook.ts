export enum WebHookStatus {
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE'
}

export interface IWebHook {
  id: number;
  name: string;
  description: string;
  status: WebHookStatus;
  recent?: boolean;
  url: string;
  application?: string;
  lastedStatus?: string;
  lastedTime?: string;
}

export interface IWebHookInfo {
  name: string;
  description: string;
  status: WebHookStatus;
  recent?: boolean;
  url: string;
  event?: string;
  application?: string;
}

export interface IWebHookParam {
  name?: string;
  description?: string;
  status?: WebHookStatus;
  url?: string;
  event?: string;
  application?: string;
}

export interface PageableObject {
  pageNumber: number
}

export interface IWebHookListResponse {
  content: IWebHook[];
  pageable: PageableObject;
  totalPages: number;
  totalElements: number;
}