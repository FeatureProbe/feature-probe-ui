export interface IRouterParams {
	projectKey: string;
	environmentKey: string;
	toggleKey: string;
  navigation: string;
}

export interface IEnvironment {
	name: string;
	key: string;
	clientSdkKey: string;
	serverSdkKey: string;
}

export interface IProject {
	name: string;
	key: string;
	description: string;
	environments: IEnvironment[];
}

export interface ITag {
	name: string;
}

export interface ITagOption {
  key: string,
  text: string,
  value: string
}

export interface IToggleParams {
  pageIndex: number;
  pageSize: number;
  environmentKey: string;
}