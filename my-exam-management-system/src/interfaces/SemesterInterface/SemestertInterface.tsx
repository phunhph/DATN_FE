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
  subjectCountInExam?: number; 
};

export interface ApiExamWithSubjectResponse extends BaseResponse {
  data: ExamWithSubject[];
}