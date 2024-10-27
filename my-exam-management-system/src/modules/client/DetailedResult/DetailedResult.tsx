import { useRef, useState } from 'react';
import './DetailedResult.scss';
import { CountdownTimer, QuestionBoard, RedirectButton } from '@components/index';
import { CandidatesInformation } from '@interfaces/CandidateInfoInterface/CandidateInfoInterface';
import { Question } from '@/interfaces/QuestionInterface/QuestionInterface';



type Props = {};

const DetailedResult = (props: Props) => {
    const [candidates] = useState<CandidatesInformation[]>([
        {
            id: 1,
            masv: "PH11111",
            name: "Nguyễn Văn A",
            dob: "2004-12-09",
            address: "Hà Nội",
            email: "anvph11111@gmail.com",
            image: "https://i.pinimg.com/736x/bb/e3/02/bbe302ed8d905165577c638e908cec76.jpg"
        }
    ]);
    const informationFake =
    {
        mssv: 1,
        name: "NHI",
        start: "2024-10-25 10:00:00",
        end: "2024-10-25 11:00:00",
        tongsoluongcauhoi: 25,
        ketqua: "25/25",
        diemso: 9,
    }

    const answers = [
        {
            questionNumber: 1,
            yourAnswer: "A.Đáp án sai nè",
            correctAnswer: "B.Đáp án đúng nè"
        },
        {
            questionNumber: 1,
            yourAnswer: "C.Đáp án đúng nè",
            correctAnswer: "B.Đáp án đúng nè"
        }
    ]

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

    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | null }>({});

    const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleQuestionSelect = (questionNumber: number) => {
        const questionIndex = questionNumber - 1;
        if (questionRefs.current[questionIndex]) {
            questionRefs.current[questionIndex]?.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <div className='detailedResult__container'>
            <div className="detailedResult__title">
                <h1>Chi tiết kết quả bài thi</h1>
            </div>
            <div className="button__another">
                <RedirectButton to="/exam" label="Làm bài thi" />
            </div>
            <div className="exam_result_detail">
                <div className="exam_result_detail-left">
                    <div className="detailedResult__table">
                        <div className="table-container">
                            <div className="table-header">
                                <h1>Kết quả bài thi</h1>
                            </div>
                            <table id="custom-table" className="custom-table">
                                <thead>
                                    <tr>
                                        <th>MSSV</th>
                                        <th>Họ Và Tên</th>
                                        <th>Thời gian bắt đầu</th>
                                        <th>Thời gian kết thúc</th>
                                        <th>Tổng số lượng câu hỏi</th>
                                        <th>Kết quả</th>
                                        <th>Điểm số</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{informationFake.mssv}</td>
                                        <td>{informationFake.name}</td>
                                        <td>{informationFake.start}</td>
                                        <td>{informationFake.end}</td>
                                        <td>{informationFake.tongsoluongcauhoi}</td>
                                        <td>{informationFake.ketqua}</td>
                                        <td>{informationFake.diemso}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="detailedResult__answer">
                        <div className="table-container">
                            <div className="table-header">
                                <h1>Chi tiết bài thi</h1>
                            </div>
                            {
                                answers.map((answer, index) => (
                                    <table id="custom-table" className="custom-table_">
                                        <thead>
                                            <tr>
                                                <th>Đáp án đã chọn</th>
                                                <th>Đáp án đúng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr key={answer.questionNumber} ref={el => questionRefs.current[index] = el}>
                                                <td>{answer.correctAnswer}</td>
                                                <td>{answer.yourAnswer}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="exam__detail-right">
                    <CountdownTimer initialTime={3600} />
                    <QuestionBoard
                        questions={questions}
                        selectedAnswers={selectedAnswers}
                        onQuestionSelect={handleQuestionSelect}
                    />
                    <div className="exam__handin_">
                        <strong>Chú thích:</strong>
                        <p>Màu xanh: Câu trả lời đúng</p>
                        <p>Màu đỏ: Câu trả lời sai</p>
                        <p>Màu vàng: Câu hỏi không trả lời</p>
                        <div className="green-line"></div>
                        <div className='exam__button_'>
                            <button>Xuất file</button>
                            <button>Trang chủ</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default DetailedResult;
