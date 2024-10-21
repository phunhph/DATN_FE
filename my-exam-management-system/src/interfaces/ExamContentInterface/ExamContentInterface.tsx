import { BaseResponse } from "@interfaces/InterfaceBaseResponse/InterfaceBaseResponse";

export interface ExamContentInterface {
  id: string | number;
  Name?: string;
  title?: string;
  Status?: boolean;
}

export interface ApiExamContentResponse extends BaseResponse {
  data: ExamContentInterface[];
}

export interface ExamContentCreate {
  id: string | number;
  exam_subject_id: string;
  title?: string;
  Status?: boolean;
}
