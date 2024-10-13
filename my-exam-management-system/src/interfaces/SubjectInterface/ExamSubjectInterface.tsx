import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";

export interface ExamSubject {
  id: string | number;
  Name: string;
  Status?: string;
}

export interface ApiExamSubjectResponse extends BaseResponse {
  data: ExamSubject[];
}

export interface SubjectCreate {
  id: string | number;
  exam_id: string;
  Name: string;
  Status?: string;
}
