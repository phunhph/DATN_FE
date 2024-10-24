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

export interface ApiQuestionResponse {
    data: Question[];
    status: string;
    success: boolean;
    warning?: string;
}