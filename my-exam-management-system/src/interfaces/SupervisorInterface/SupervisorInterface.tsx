import { BaseResponse } from "@interfaces/InterfaceBaseResponse/InterfaceBaseResponse";

export interface Supervisor {
  idcode: string;
  name: string;
  profile: string;
  email: string;
  status?: boolean | string | number;
}

export interface ApiSupervisorResponse extends BaseResponse {
  data: Supervisor[];
}

export interface CreateSupervisor {
  idcode: string;
  name: string;
  profile: string;
  email: string;
  status?: boolean | string | number;
}
