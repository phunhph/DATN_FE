import { BaseResponse } from "@interfaces/InterfaceBaseResponse/InterfaceBaseResponse";

export interface Supervisor {
  id: string;
  magt: string;
  name: string;
  image: string;
  dob: string;
  address: string;
  status?: boolean;
}

export interface ApiSupervisorResponse extends BaseResponse {
  data: Supervisor[];
}
