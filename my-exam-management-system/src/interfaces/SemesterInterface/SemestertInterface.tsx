import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";

export type Semester = {
  id: string;
  name: string;
  time_start: string;
  time_end: string;
  status: boolean;
}

export interface ApiSemesterResponse extends BaseResponse {
  data: Semester[];
}

export type ExamWithSubject = {
  examId?: string; 
  examName?: string; 
  subjectName?: string; 
  subjectCode?: string; 
  questionCount?: number; 
  startDate?: string; 
  endDate?: string; 
  examDate?: string; 
  subjectCountInExam?: number; 
  percentage?: number; 
  date_end?:any;
};

export interface ApiScoreBoardResponse extends BaseResponse {
  data: SemScoreBoardster[];
}

export type SemScoreBoardster = {
  exam_id: string;
  exam_name: string;
  point: number;
  subject_id: string;
  subject_name: string;
}
