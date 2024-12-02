import { BaseResponse } from "@interfaces/InterfaceBaseResponse/InterfaceBaseResponse";

export interface ExamContentInterface {
  id: string | number;
  title?: string;
  status?: boolean;
  url_listening?:string;
  description?:string;
}

export interface ApiExamContentResponse extends BaseResponse {
  data: ExamContentInterface[];
}

export interface ExamContentCreate {
  id: string | number;
  exam_subject_id: string;
  title?: string;
  status?: boolean;
  url_listening?: string;
  description?: string;
}
