import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";

export interface Question {
    questionNumber: number;
    questionText: string;
    image?: string;
    answers: {
        id: number;
        text?: string; 
        image?: string;
        isCorrect: boolean;
    }[];
}

export interface ApiQuestionResponse extends BaseResponse {
    data: Question[];
}