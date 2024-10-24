import React, { useState, useRef } from 'react';
import './Exam.scss';
import { Question } from '@interfaces/QuestionInterface/QuestionInterface';
import { CandidatesInformation } from '@interfaces/CandidateInfoInterface/CandidateInfoInterface';
import { CandidateAvatarName, QuestionBoard, QuestionAnswerImage, CountdownTimer } from '@components/index';


type Props = {};

const Exam: React.FC<Props> = () => {
    const [questions] = useState<Question[]>([
        {
            questionNumber: 1,
            questionText: "What is the capital of France?",
            image: "https://picsum.photos/400/400",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "London", isCorrect: false },
                { id: 3, text: "Berlin", isCorrect: false },
                { id: 4, text: "Madrid", isCorrect: false },
            ]
        },
        {
            questionNumber: 2,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 3,
            questionText: "Which museum is located in Paris?",
            image: "https://picsum.photos/400/400",
            answers: [
                { id: 1, image: "https://picsum.photos/200/200", isCorrect: true },
                { id: 2, text: "British Museum", isCorrect: false },
                { id: 3, text: "Metropolitan Museum", isCorrect: false },
                { id: 4, text: "Prado Museum", isCorrect: false },
            ]
        },
        {
            questionNumber: 4,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 5,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 6,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 7,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 8,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 9,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 10,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 11,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
    ]);

    const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleQuestionSelect = (questionNumber: number) => {
        const questionIndex = questionNumber - 1;
        if (questionRefs.current[questionIndex]) {
            questionRefs.current[questionIndex]?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | null }>({});

    const handleAnswerSelect = (questionNumber: number, answerId: number) => {
        console.log(`Selected question: ${questionNumber}, answer: ${answerId}`);
        setSelectedAnswers((prev) => {
            const newSelectedAnswers = {
                ...prev,
                [questionNumber]: answerId
            };
            console.log('Updated selectedAnswers:', newSelectedAnswers);
            return newSelectedAnswers;
        });
    };

    const [candidates] = useState<CandidatesInformation[]>([
        {
            id: 1,
            masv: "PH11111",
            name: "Nguyễn Văn A",
            dob: "2004-12-09",
            address: "Hà Nội",
            email: "anvph11111@gmail.com",
            image: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
        }
    ]);

    const candidate = candidates[0];

    const handleSubmit = () => {
        const confirmSubmit = window.confirm("Bạn có chắc chắn muốn nộp bài không?");
        if (confirmSubmit) {
            alert("Nộp bài thành công!");
        }
    };

    return (
        <div className='exam__container'>
            <div className="exam__title">
                <h1>Làm bài thi</h1>
            </div>
            <div className="exam__detail">
                <div className="exam__detail-left">
                    {questions.map((question, index) => (
                        <div key={question.questionNumber} ref={el => questionRefs.current[index] = el}>
                            <QuestionAnswerImage
                                question={question}
                                onAnswerSelect={handleAnswerSelect}
                                selectedAnswerIndex={selectedAnswers[question.questionNumber] || null}
                            />
                        </div>
                    ))}
                </div>
                <div className="exam__detail-right">
                    <CountdownTimer initialTime={3600} />
                    <QuestionBoard
                        questions={questions}
                        selectedAnswers={selectedAnswers}
                        onQuestionSelect={handleQuestionSelect}
                    />
                    <CandidateAvatarName candidate={candidate} />
                    <div className="exam__handin">
                        <button onClick={handleSubmit}>Nộp bài</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Exam;
