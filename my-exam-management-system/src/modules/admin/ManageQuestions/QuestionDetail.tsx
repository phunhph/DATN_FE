import { useState } from "react";
import "./QuestionDetail.scss";
import { Notification } from "../../../components";


const QuestionDetail = () => {
    // useAuth();
    const [errors, setErrors] = useState<ErrorQuestions>({});
    const [notifications, setNotifications] = useState<
        Array<{ message: string; isSuccess: boolean }>
    >([]);
    const addNotification = (message: string, isSuccess: boolean) => {
        setNotifications((prev) => [...prev, { message, isSuccess }]);
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const [formData] = useState<formDataQuestion>({
        id: "",
        questionLevel: "",
        questionContent: "",
        correctAnswer: "",
        fileQuestionContent: null,
        wrongAnswer1: "",
        wrongAnswer2: "",
        wrongAnswer3: "",
        fileCorrectAnswer: null,
        fileWrongAnswer1: null,
        fileWrongAnswer2: null,
        fileWrongAnswer3: null,
    });
    interface formDataQuestion {
        id: string;
        questionLevel: string;
        questionContent: string;
        correctAnswer: string;
        fileQuestionContent?: string | null;
        wrongAnswer1: string;
        wrongAnswer2: string;
        wrongAnswer3: string;
        fileCorrectAnswer?: string | null;
        fileWrongAnswer1?: string | null;
        fileWrongAnswer2?: string | null;
        fileWrongAnswer3?: string | null;
    }

    interface ErrorQuestions {
        id?: string;
        questionLevel?: string;
        questionContent?: string;
        correctAnswer?: string;
        wrongAnswer1?: string;
        wrongAnswer2?: string;
        wrongAnswer3?: string;
    }

    const validate = (): boolean => {
        const errors: ErrorQuestions = {};
        if (!formData.id) errors.id = "Mã câu hỏi không được để trống.";
        if (!formData.questionLevel)
            errors.questionLevel = "Mức độ câu hỏi không được để trống.";
        if (!formData.questionContent)
            errors.questionContent = "Nội dung câu hỏi không được để trống.";
        if (!formData.correctAnswer)
            errors.correctAnswer = "Đáp án đúng không được để trống.";
        if (!formData.wrongAnswer1)
            errors.wrongAnswer1 = "Đáp án sai 1 không được để trống.";
        if (!formData.wrongAnswer2)
            errors.wrongAnswer2 = "Đáp án sai 2 không được để trống.";
        if (!formData.wrongAnswer3)
            errors.wrongAnswer3 = "Đáp án sai 3 không được để trống.";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    return (
        <div className="Questions__detail__container">
            <div className="Questions__detail__title">
                <h1>Chi tiết câu hỏi</h1>
            </div>
            <main>
                <div className="detail_question">
                    <h3>Câu hỏi: <span>aaaaa</span></h3>
                    <img src="" alt="" />
                    <h3>Câu hỏi: <span>aaaaa</span></h3>
                    <img src="" alt="" />
                    <h3>Câu hỏi: <span>aaaaa</span></h3>
                    <img src="" alt="" />
                    <h3>Câu hỏi: <span>aaaaa</span></h3>
                    <img src="" alt="" />
                    <h3>Câu hỏi: <span>aaaaa</span></h3>
                    <img src="" alt="" />
                </div>
                <div className="question_active">
                    <h3>bảng vs</h3>
                </div>
            </main>
            <Notification
                notifications={notifications}
                clearNotifications={clearNotifications}
            />
        </div>
    );
};

export default QuestionDetail;
