import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";

export interface Exam {
  id: number | string;
  name: string;
  time_start: string;
  time_end: string;
  status?: boolean;
}

export interface ApiExamResponse extends BaseResponse {
  data?: Exam[];
}
