import React from 'react';
import { Question } from '@interfaces/QuestionInterface/QuestionInterface';
import "./QuestionBoard.scss"

interface QuestionBoardProps {
    questions: Question[];
    selectedAnswers: { [key: number]: number | null };
    onQuestionSelect: (questionNumber: number) => void;
}

const QuestionBoard: React.FC<QuestionBoardProps> = ({ questions, selectedAnswers, onQuestionSelect }) => {
    const chunkQuestions = (questions: Question[], size: number) => {
        const result = [];
        for (let i = 0; i < questions.length; i += size) {
            result.push(questions.slice(i, i + size));
        }
        return result;
    };

    const chunkedQuestions = chunkQuestions(questions, 5);

    return (
        <div className="question__board">
            <div className="question__board-heading">
                <h2>Bảng câu hỏi</h2>
            </div>
            <div className="question__board-selection">
                {chunkedQuestions.map((row, rowIndex) => (
                    <div className="question__row" key={rowIndex}>
                        {row.map((question) => (
                            <div
                                className="question__select"
                                key={question.questionNumber}
                                onClick={() => onQuestionSelect(question.questionNumber)}
                            >
                                <div className="question__select-number">{question.questionNumber}</div>
                                <div
                                    className={`question__select-color ${selectedAnswers[question.questionNumber] !== undefined ? 'selected' : ''}`}
                                ></div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default QuestionBoard;
