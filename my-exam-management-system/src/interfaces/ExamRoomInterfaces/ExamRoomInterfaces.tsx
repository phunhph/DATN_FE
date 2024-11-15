import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";
import { Session } from "../SessionInterface/SessionInterface";
import { ExamSubject } from "../SubjectInterface/ExamSubjectInterface";
import { ExamRoomDetailInterface } from "./ExamRoomDetailInterfaces";

export interface ExamRoom {
  id: string | number;
  name: string;
  candidates_count: number;
  exam_subject_name: string;
  exam_session_name: string;
  exam_session_time_start: string;
  exam_session_time_end:string;
}

export interface ApiExamRoomResponse extends BaseResponse {
  data: ExamRoom[];
}

export interface ApiExamRoomDetail extends BaseResponse {
  data: ExamRoomDetail;
}
export interface ExamRoomDetail {
  examRoom: ExamRoom;
  exam_room_details: ExamRoomDetailInterface[];
  exam_sessions: Session[];
  exam_subjects: ExamSubject[];
}
