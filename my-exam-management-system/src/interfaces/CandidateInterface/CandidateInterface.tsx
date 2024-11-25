import { BaseResponse } from "@interfaces/InterfaceBaseResponse/InterfaceBaseResponse";

export interface Candidate {
  idcode: string;
  exam_room_id: number | string;
  exam_id: string;
  name: string;
  image: string;
  dob: string;
  address: string;
  email: string;
  exam_room: Exam_room;
  status: number | string;
}

export interface ApiCandidateResponse extends BaseResponse {
  data: Candidate[];
}

export interface CreateCandidate {
  idcode: string;
  name: string;
  image: string | File;
  imagePreviewUrl?: string;
  dob: string;
  address: string;
  email: string;
  status: number | string | boolean;
}

export interface Exam_room {
  id: number;
  exam_id: string;
  name: string;
}

export interface ApiCandidateResponse__ extends BaseResponse {
  data?: Candidate_all;
}

export interface Candidate_all {
  time: number;
  question: Question___[];
}

export interface Question___ {
  id: string;
  title: string;
  image_title?: string;
  answer: {
    id: string;
    correct: string;
    img_correct?: string;
    img_wrong1?: string;
    img_wrong2?: string;
    img_wrong3?: string;
    temp?: string;
    wrong1: string;
    wrong2: string;
    wrong3: string;
    id_pass?:number;
  };
}
