import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";

export interface Session {
  id: string|number;
  name: string|number;
  time_start: string; 
  time_end: string; 
  status?:boolean
}

export interface ApiSessionResponse extends BaseResponse {
  data: Session[];
}

export interface SessionCreate {
  id: string | number;
  name: string | number;
  time_start: string;
  time_end: string;
  status?: boolean;
}
