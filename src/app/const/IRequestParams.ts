
export interface IRequestParams {
  url?: string;
  body?: any;
  parms?: Array<{ key: string, value: string }>;
  headers?: Array<{ key: string, value: string }>;
  server?: string;
  file?: any;
  _serverUrl?: string;
  isAuth?: boolean;
}

export interface iConf {
  server?: Array<{
    url : string
  }>;
  module?: Array<{
    name: string,
    isPublic:boolean
  }>;
  images?: any;
  labels?: any;
}


