import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";


export interface Exam {
  id: number | string;
  Name: string;
  TimeStart: string;
  TimeEnd: string;
  Status?: boolean;
}

export interface ApiExamResponse extends BaseResponse {
  data?: Exam[];
}
