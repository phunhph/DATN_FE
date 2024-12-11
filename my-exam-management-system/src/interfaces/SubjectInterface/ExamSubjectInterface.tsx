import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";

export interface ExamSubject {
  id: number|string;
  name: string;
  status?: boolean;
  time_start?:string;
  time_end?:string;
  exam_date?:string;
  exam_end?:string;
}

export interface ApiExamSubjectResponse extends BaseResponse {
  data: ExamSubject[];
}

export interface SubjectCreate {
  id: number|string;
  exam_id?: number|string;
  name: string;
  status?: boolean;
}
