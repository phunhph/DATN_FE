import React from 'react';
import "./QuestionAnswerImage.scss";
import { Question } from '@interfaces/QuestionInterface/QuestionInterface';

type Props = {
    question: Question;
    onAnswerSelect: (questionNumber: number, answerIndex: number) => void; 
    selectedAnswerIndex: number | null; 
};

const QuestionAnswerImage: React.FC<Props> = ({ question, onAnswerSelect, selectedAnswerIndex }) => {
    const getAnswerLetter = (index: number) => {
        const letters = ['A', 'B', 'C', 'D'];
        return letters[index];
    };

    return (
        <div className="exam__question">
            <p>{question.questionNumber}. {question.questionText}</p>
            {question.image && (
                <div className="exam__question-image">
                    <img src={question.image} alt={`Question ${question.questionNumber}`} />
                </div>
            )}
            <div className="exam__answer">
                {question.answers.map((answer, index) => (
                   <div key={answer.id} className={`exam__answer-box ${selectedAnswerIndex === answer.id ? 'selected' : ''}`} 
                        onClick={() => onAnswerSelect(question.questionNumber, answer.id)} >
                        <div className="exam__answer-option"> {getAnswerLetter(index)}</div>
                        <div className="exam__answer-content">
                            {answer.image ? (
                                <div className="exam__answer-image">
                                    <img src={answer.image} alt={`Answer ${getAnswerLetter(index)}`} />
                                </div>
                            ) : (
                                <div className="exam__answer-text">{answer.text}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default QuestionAnswerImage;
