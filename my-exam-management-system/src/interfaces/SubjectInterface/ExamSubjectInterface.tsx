import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";

export interface ExamSubject {
  id: number|string;
  name: string;
  status?: boolean;
}

export interface ApiExamSubjectResponse extends BaseResponse {
  data: ExamSubject[];
}

export interface SubjectCreate {
  id: number|string;
  exam_id: number|string;
  name: string;
  status?: boolean;
}
