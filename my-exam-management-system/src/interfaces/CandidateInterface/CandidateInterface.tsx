import { BaseResponse } from "@interfaces/InterfaceBaseResponse/InterfaceBaseResponse";

export interface Candidate {
    id: string;
    sbd:string;
    name: string;
    image:string;
    dob:string;
    address:string;
    status:string
}

export interface ApiCandidateResponse extends BaseResponse {
    data: Candidate[];
}
