import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";


export interface Exam {
  id: number | string;
  Name: string;
  TimeStart: string;
  TimeEnd: string;
  Status?: string;
}

export interface ApiExamResponse extends BaseResponse {
  data?: Exam[];
}
