import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";

export interface Question {
    id: string;
    exam_content_id: string;
    title: string;
    answer_P: string;
    answer_F1: string;
    answer_F2: string;
    answer_F3: string;
    level: string;
    image_title?: string | null;
    Image_P?: string | null;
    Image_F1?: string | null;
    Image_F2?: string | null;
    image_F3?: string | null;
  }

export interface ApiQuestionResponse extends BaseResponse {
    data: Question[];
}