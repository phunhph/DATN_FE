/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import "./QuestionAnswerImage.scss";
import { Question } from '@interfaces/QuestionInterface/QuestionInterface';
import getAnswerLetter from '@/utilities/getAnswerLetter';

type Props = {
    question: Question;
    onAnswerSelect: (MaMon: string,questionNumber: number, answerIndex: number) => void;
    selectedAnswerIndex: number | null;
};

const QuestionAnswerImage: React.FC<Props> = ({ question, onAnswerSelect, selectedAnswerIndex }) => {


    const renderAnswer = (answer: any, index: number) => { 
        const isSelected = selectedAnswerIndex === answer.id;
        return (
            <div key={answer.id} className={`exam__answer-box ${isSelected ? 'selected' : ''}`} 
                onClick={() => onAnswerSelect(question.id,question.questionNumber, answer.id)}>
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
        );
    };

    if (question.answers.length === 4) {
        return (
            <div className="exam__question">
                <p>{question.questionNumber}. {question.questionText}</p>
                {question.image && (
                    <div className="exam__question-image">
                        <img src={question.image} alt={`Question ${question.questionNumber}`} />
                    </div>
                )}
                <div className="exam__answer">
                    {question.answers.map((answer, index) => renderAnswer(answer, index))}
                </div>
            </div>
        );
    }

    if (question.answers.length === 2) {
        return (
            <div className='exam__question-radio'>
                <div>{question.questionText}</div>
                <div>
                    {question.answers.map((answer, index) => (
                        <label key={answer.id} htmlFor={`radioSelect-${question.questionNumber}-${index}`} className="exam__question-label">
                            {answer.text}
                            <input 
                                className='radioinput'
                                type="radio"
                                value={answer.text}
                                name={`radioSelect-${question.questionNumber}`}
                                id={`radioSelect-${question.questionNumber}-${index}`}
                                checked={selectedAnswerIndex === answer.id}
                                onChange={() => onAnswerSelect(question.id,question.questionNumber ,answer.id)}
                            />
                            <span className="radiomark"></span>
                        </label>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

export default QuestionAnswerImage;
