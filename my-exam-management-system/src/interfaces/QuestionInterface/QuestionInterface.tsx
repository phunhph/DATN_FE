export interface Question {
    id:string;
    questionNumber: number;
    questionText: string;
    image?: string;
    answers: {
        id: number;
        text?: string; 
        image?: string;
        isCorrect?: boolean;
    }[];
}

export interface ApiQuestionResponse {
    data: Question[];
    status: string;
    success: boolean;
    warning?: string;
}

export interface APIresultOfCandidate {
    timeSpent: number;
    answers: {
        multipleChoice: {
            [key:string]: number;
        }
        reading: {
            [key:string]: number;
        }
        listening: {
            [key:string]: number;
        }
    }
}