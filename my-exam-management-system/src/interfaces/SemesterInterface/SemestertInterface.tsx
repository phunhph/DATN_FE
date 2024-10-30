import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";

export type Semester = {
  id: string;
  name: string;
  time_start: string;
  time_end: string;
  status: boolean;
}

export interface ApiSemesterResponse extends BaseResponse {
  data: Semester[];
}
