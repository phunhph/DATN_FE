import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";

export interface ExamRoom {
    id: string;
    name: string;
}

export interface ApiExamRoomResponse extends BaseResponse {
  data: ExamRoom[];
}
