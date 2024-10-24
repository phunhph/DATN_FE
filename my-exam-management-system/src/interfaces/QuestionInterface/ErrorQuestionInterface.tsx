export interface ErrorQuestion {
    questionNumber?: number;
    questionText?: string;
    image?: string;
    answers?: {
        id?: number;
        text?: string;
        isCorrect?: boolean;
    }[];
}
