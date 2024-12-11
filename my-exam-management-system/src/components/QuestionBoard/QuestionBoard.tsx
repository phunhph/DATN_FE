import React, { useEffect, useState } from 'react';
import { Question } from '@interfaces/QuestionInterface/QuestionInterface';
import "./QuestionBoard.scss"
import Button from '../Button/Button';

interface QuestionBoardProps {
    questions: Question[];
    selectedAnswers: { [key: number]: number | null };
    onQuestionSelect: (questionNumber: number) => void;
    onViewChange: (view: string) => void;
    initialView:string;
}

const QuestionBoard: React.FC<QuestionBoardProps> = ({ questions, selectedAnswers, onQuestionSelect, onViewChange, initialView }) => {
    const [currentView, setCurrentView] = useState("Trắc nghiệm");

    const handleViewChange = (view: string) => {
        setCurrentView(view);
        onViewChange(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const chunkQuestions = (questions: Question[], size: number) => {
        const result = [];
        for (let i = 0; i < questions.length; i += size) {
            result.push(questions.slice(i, i + size));
        }
        return result;
    };

    const chunkedQuestions = chunkQuestions(questions, 6);

    useEffect(() => {
        onViewChange(initialView);
    }, [initialView, onViewChange]);
    return (
        <div className="question__board">
            <div className="question__board-heading">
                <div className="question__board-buttons">
                    <Button onClick={() => handleViewChange("Trắc nghiệm")}>Trắc nghiệm</Button>
                    <Button onClick={() => handleViewChange("Bài đọc")}>Bài đọc</Button>
                    <Button onClick={() => handleViewChange("Bài nghe")}>Bài nghe</Button>
                </div>
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
