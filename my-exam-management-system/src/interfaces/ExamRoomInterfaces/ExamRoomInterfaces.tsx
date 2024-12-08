import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";
import { ExamSubject } from "../SubjectInterface/ExamSubjectInterface";
import { ExamRoomDetailInterface } from "./ExamRoomDetailInterfaces";
import { Exam } from "../ExamInterface/ExamInterface";

export interface ExamRoomDetails {
  id: string | number;
  name: string;
  candidates_count: number;
  exam_subject_name: string;
  exam_session_name: string;
  exam_session_time_start: string;
  exam_session_time_end: string;
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
export interface ExamRoom {
  id: string | number;
  exam_id: string;
  name: string;
}
export interface UpdateExamRoom {
  exam_room: ExamRoomUpdate;
  exam: Exam[];
  exam_sessions: Session[];
  exam_subjects: ExamSubject[];
  exam_date:string;
}

export interface ExamRoomDetailTables {
  exam_id: string | number;
  name: string;
  exam_session_name: string | number;
  exam_subject_name: string;
  exam_session_time_start: string;
  exam_session_time_end: string;
}
export interface ExamRoomAPIUpdate {
  name?: string | undefined;
  exam_id?: string | undefined;
  exam_session_id?: string | number | undefined;
  exam_subject_id?: string | number | undefined;
}
export interface ExamRoomUpdate {
  id: string;
  name: string;
  exam_room_detail: {
    id: string;
    exam_room_id: string;
    exam_session_id: string;
    exam_subject_id:string;
    exam_date:string;
  };
}
export interface Session {
  id: string;
  name: string;
  time_start: string;
  time_end: string;
}
