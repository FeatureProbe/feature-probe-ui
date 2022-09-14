import { IPageable, ISort } from './toggle';

export interface IApproval {
  approvedBy: string;
  createdTime: string;
  environmentKey: string;
  environmentName: string;
  reviewers: string[];
  projectKey: string;
  projectName: string;
  status: string;
  submitBy: string;
  title: string;
  toggleKey: string;
  toggleName: string;
  comment?: string;
  approvalTime?: string;
  sketchTime?: string;
  locked?: boolean;
  lockedTime?: string;
}

export interface IApprovalList {
  totalElements: number;
  totalPages: number;
  sort: ISort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: IPageable;
  size: number;
  content: IApproval[];
  number: number;
  empty: boolean;
}

export interface IApprovalParams {
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
  status: string;
  type: string;
}

export interface IApprovalSetting {
  reviewers: string[];
  enable: boolean;
  environmentKey: string;
}

export interface ISettings {
  approvalSettings: IApprovalSetting[]
}