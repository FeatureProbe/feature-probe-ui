import { IPageable, ISort } from "./toggle";

export interface IVariation {
  id: string;
  name?: string;
  value?: string;
  description?: string;
  key?: string;
  text?: string;
  inputValue?: number;
  percentage?: string;
}

export interface IOption {
  key: string;
  text: string;
  value: string;
}

export interface ICondition {
  id: string;
  type: string;
  subject: string;
  predicate: string;
  objects?: string[];
  datetime?: string;
  timezone?: string;
}

export interface IServe {
  split?: number[];
  select?: number;
}

export interface IRule {
  id: string;
  name: string;
  conditions: ICondition[];
  serve?: IServe;
}

export interface IToggleInfo {
  name: string;
  key: string;
  tags: string[];
  desc: string;
  createdBy: string;
  createdTime: string;
  disabledServe: number;
  modifiedBy: string;
  modifiedTime: string;
  returnType: string;
  clientAvailability: boolean;
  variations: IVariation[];
}

export interface ITarget {
  rules: IRule[];
  variations: IVariation[];
  defaultServe: IServe;
  disabledServe: IServe;
}

export interface IContent {
  version?: number;
  disabled?: boolean;
  comment?: string;
  content?: ITarget;
  modifiedBy?: string;
  modifiedTime?: string;
}

export interface IModifyInfo {
  modifiedBy?: string;
  modifiedTime?: string;
}

export interface IValues {
  count: number;
  value: string;
  deleted: boolean;
}

export interface IMetric {
  name: string;
  values: IValues[];
  lastChangeVersion?: number;
}

export interface IMetricContent {
  isAccess: boolean;
  metrics: IMetric[],
  summary: IValues[]
}

export interface IMetricParams {
  lastHours: string;
  metricType: string;
}

export interface IVersion {
  projectKey: string,
  environmentKey: string,
  comment: string,
  content: ITarget;
  version: number,
  createdTime: string;
  createdBy: string;
  disabled: boolean;
}

export interface ITargetingVersions {
  totalElements: number;
  totalPages: number;
  sort: ISort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: IPageable;
  size: number;
  content: IVersion[];
  number: number;
  empty: boolean;
}

export interface ITargetingVersionsByVersion {
  total: number;
  versions: IVersion[]
}

export interface IDictionary {
  key: string;
  createdTime: string;
  value: string;
  updatedTime: string;
}
