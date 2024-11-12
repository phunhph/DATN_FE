import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";

export interface ExamRoom {
    id: string;
    name: string;
    candidates_count: number;
}

export interface ApiExamRoomResponse extends BaseResponse {
  data: ExamRoom[];
}
