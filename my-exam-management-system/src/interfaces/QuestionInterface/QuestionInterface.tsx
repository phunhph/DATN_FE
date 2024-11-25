import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";

export interface Question {
  id: string;
  question_id?: string;
  exam_content_id: string;
  title: string;
  answer_P: string;
  answer_F1: string;
  answer_F2: string;
  answer_F3: string;
  level: string;
  version?: string;
  image_title?: string | null;
  image_P?: string | null;
  image_F1?: string | null;
  image_F2?: string | null;
  image_F3?: string | null;
  created_at?: string | null;
}

export interface ApiQuestionResponse extends BaseResponse {
  data: Question[];
}

export interface QuestionDetailResponse {
  id: string;
  exam_content_id: string;
  current_version_id: number | string;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  current_version: Question[];
}

export interface ApiQuestionDetailResponse extends BaseResponse {
  data?: QuestionDetailResponse;
}
export interface ApiQuestionResponse {
    data: Question[];
    status: string;
    success: boolean;
    warning?: string;
}

export interface APIresultOfCandidate {
    timeSpent: number;
    answers: {
        multipleChoice: {
            [key:string]: number;
        }
        reading: {
            [key:string]: number;
        }
        listening: {
            [key:string]: number;
        }
    }
}