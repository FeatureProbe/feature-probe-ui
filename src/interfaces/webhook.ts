export interface IWebHook {
  key: number;
  name: string;
  description: string;
  status: boolean;
  application: string;
  url: string;
}

export interface IWebHookInfo {
  key: number;
  name: string;
  description: string;
  status: boolean;
  application: string;
  url: string;
  event?: string;
}