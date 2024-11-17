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
