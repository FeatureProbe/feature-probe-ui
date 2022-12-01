export interface IToken {
  [key: string]: unknown;
  name: string;
  role?: ROLE;
}

export interface ITokenListItem extends IToken {
  id: number;
  createdBy?: string;
  visitedTime?: string;
}

export enum ROLE {
  OWNER = 'OWNER',
  WRITER = 'WRITER'
}

export enum TOKENTYPE {
  PERSON = 'PERSON',
  APPLICATION = 'APPLICATION'
}

export interface CreateTokenParam {
  type: TOKENTYPE,
  name: string,
  role?: ROLE
}

export interface PageableObject {
  pageNumber: number
}

export interface ITokenListResponse {
  content: IToken[];
  pageable: PageableObject;
  totalPages: number;
  totalElements: number;
}
