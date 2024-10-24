export interface CandidatesInformation {
    id: number;
    masv:number|string;
    name: string;
    dob: string;
    address: string;
    email: string;
    image:string
  }
  
  export interface ApiCandidateInformationResponse {
    data: CandidatesInformation[];
    status: string;
    success: boolean;
    warning?: string;
  }
  