import { useEffect, useState } from "react";
import "./QuestionDetail.scss";
import { Notification } from "../../../components";
import { useLocation } from "react-router-dom";
import { getQuestionById } from "@/services/repositories/QuestionServices/QuestionServices";
import {
    Question,
    QuestionDetailResponse,
} from "@/interfaces/QuestionInterface/QuestionInterface";

interface answer {
    current_version_id: string;
    created_at: string;
    level: string;
}

const QuestionDetail = () => {
    const [questions, setQuestions] = useState<Question>();
    const [answer, setAnswer] = useState<answer[]>([]);
    const location = useLocation();
    const { id } = location.state || {};

    const getQuestionByid = async (id: string) => {
        const result = await getQuestionById(id);
        if (result.success && result.data) {
            formatDataQuestion(result.data);
        }
    };

    const formatDataQuestion = (data: QuestionDetailResponse) => {
        let question: Question = {} as Question;
        const version: answer[] = [];

        data.current_version.forEach((e) => {
            version.push({
                current_version_id: e.version ?? "",
                created_at: e.created_at ?? "",
                level: e.level ?? "",
            });
            console.log(e);

            if (e.id == data.current_version_id) {
                question = {
                    id: e.question_id ?? "-",
                    exam_content_id: e.exam_content_id ?? "",
                    title: e.title ?? "",
                    answer_P: e.answer_P ?? "",
                    answer_F1: e.answer_F1 ?? "",
                    answer_F2: e.answer_F2 ?? "",
                    answer_F3: e.answer_F3 ?? "",
                    level: e.level ?? "",
                    image_title: e.image_title ?? "",
                    image_P: e.image_P ?? "",
                    image_F1: e.image_F1 ?? "",
                    image_F2: e.image_F2 ?? "",
                    image_F3: e.image_F3 ?? "",
                };
            }
        });

        setAnswer(version);
        setQuestions(question);
    };

    useEffect(() => {
        getQuestionByid(id);
    }, []);

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
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [formData, setFormData] = useState<formDataQuestion>({
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

    const [modalType, setModalType] = useState<
        "add" | "edit" | "file" | string | undefined
    >("add");

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
    const closeModal = () => {
        setModalIsOpen(false);
    };

    const openEdit = () => {
        setModalIsOpen(true);
        setErrors({});
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            if (editMode) {
                alert("Cập nhật câu hỏi thành công!");
            }
            setFormData({
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
            closeModal();
        }
    };
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

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
                {/* Hiển thị chi tiết thông tin câu hỏi */}
                <div className="detail_question">
                    <h3>
                        Mã câu hỏi: <span>{questions?.id}</span>
                    </h3>
                    <h3>
                        Nội dung câu hỏi: <span>{questions?.title}</span>
                    </h3>
                    {questions?.image_title && (
                        <div>
                            <h3>Hình ảnh câu hỏi:</h3>
                            <img
                                src={`http://example.com/${questions.image_title}`}
                                alt="Hình ảnh câu hỏi"
                                className="question-image"
                            />
                        </div>
                    )}
                    <h3>
                        Đáp án đúng: <span>{questions?.answer_P}</span>
                    </h3>
                    {questions?.image_P && (
                        <div>
                            <h3>Hình ảnh đáp án đúng:</h3>
                            <img
                                src={`http://example.com/${questions.image_P}`}
                                alt="Hình ảnh đáp án đúng"
                                className="answer-image"
                            />
                        </div>
                    )}
                    <h3>
                        Đáp án sai 1: <span>{questions?.answer_F1}</span>
                    </h3>
                    {questions?.image_F1 && (
                        <div>
                            <h3>Hình ảnh đáp án sai 1:</h3>
                            <img
                                src={`http://example.com/${questions.image_F1}`}
                                alt="Hình ảnh đáp án sai 1"
                                className="answer-image"
                            />
                        </div>
                    )}
                    <h3>
                        Đáp án sai 2: <span>{questions?.answer_F2}</span>
                    </h3>
                    {questions?.image_F2 && (
                        <div>
                            <h3>Hình ảnh đáp án sai 2:</h3>
                            <img
                                src={`http://example.com/${questions.image_F2}`}
                                alt="Hình ảnh đáp án sai 2"
                                className="answer-image"
                            />
                        </div>
                    )}
                    <h3>
                        Đáp án sai 3: <span>{questions?.answer_F3}</span>
                    </h3>
                    {questions?.image_F3 && (
                        <div>
                            <h3>Hình ảnh đáp án sai 3:</h3>
                            <img
                                src={`http://example.com/${questions.image_F3}`}
                                alt="Hình ảnh đáp án sai 3"
                                className="answer-image"
                            />
                        </div>
                    )}
                    <button className="" onClick={openEdit}>
                        Sửa
                    </button>
                </div>
                {/* Hiển thị thông tin bảng so sánh các phiên bản */}
                <div className="question_active">
                    <h3>Bảng so sánh các phiên bản</h3>
                    <table className="version_table">
                        <thead>
                            <tr>
                                <th>Phiên bản</th>
                                <th>Mức độ</th>
                                <th>Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {answer.map((item, index) => (
                                <tr key={index}>
                                    <td>{item?.current_version_id}</td>
                                    <td>{item?.level}</td>
                                    <td>
                                        {new Date(item?.created_at || "").toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            {modalIsOpen && (
                <div className="modal1">
                    <div className="modal1__overlay">
                        <div className="modal1__content">
                            <button className="modal1__close" onClick={closeModal}>
                                X
                            </button>
                            <h2 className="modal__title">
                                {modalType === "edit"
                                    ? "Chỉnh sửa câu hỏi"
                                    : modalType === "file"
                                        ? "Tải lên file"
                                        : "Thêm mới câu hỏi"}
                            </h2>

                            <form className="modal1__form" onSubmit={handleSubmit}>
                                <div className="modal1__firstline">
                                    <label className="modal1__label">
                                        Mã câu hỏi: <br />
                                        <input
                                            type="text"
                                            name="id"
                                            value={formData.id}
                                            onChange={handleChange}
                                            className="modal1__input"
                                            placeholder="Nhập mã câu hỏi"
                                        />
                                        {errors.id && (
                                            <span className="error_question">{errors.id}</span>
                                        )}
                                    </label>

                                    <label className="modal1__label">
                                        Mức độ câu hỏi: <br />
                                        <select
                                            name="questionLevel"
                                            value={formData.questionLevel}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    questionLevel: e.target.value,
                                                })
                                            }
                                            className="subject__select1"
                                        >
                                            <option value="Dễ">Dễ</option>
                                            <option value="Trung bình">Trung Bình</option>
                                            <option value="Khó">Khó</option>
                                        </select>
                                        {errors.questionLevel && (
                                            <span className="error_question">
                                                {errors.questionLevel}
                                            </span>
                                        )}
                                    </label>
                                </div>
                                <div className="model1__question">
                                    <label className="modal1__label">
                                        Nội dung câu hỏi: <br />
                                        <textarea
                                            name="questionContent"
                                            value={formData.questionContent}
                                            onChange={handleChange}
                                            className="modal1__input"
                                            placeholder="Nhập nội dung"
                                        />
                                    </label>

                                    {errors.questionContent && (
                                        <span className="error_question">
                                            {errors.questionContent}
                                        </span>
                                    )}
                                    <div className="upload-file">
                                        <input type="file" className="upload-file__input" />
                                        <button className="upload-file__button">
                                            <ion-icon
                                                name="cloud-upload-outline"
                                                className="upload-file__icon"
                                                style={{ fontSize: "24px", marginRight: "5px" }}
                                            ></ion-icon>
                                            Upload File
                                        </button>
                                    </div>
                                </div>

                                <div className="model1__second">
                                    <div className="model1__input">
                                        <label className="modal1__label">
                                            Đáp án đúng: <br />
                                            <textarea
                                                name="correctAnswer"
                                                onChange={handleChange}
                                                value={formData.correctAnswer}
                                                className="input__input"
                                                placeholder="Nhận đáp án đúng"
                                            />
                                        </label>
                                        <div className="upload-file">
                                            <input type="file" className="upload-file__input" />
                                            <button className="upload-file__button">
                                                <ion-icon
                                                    name="cloud-upload-outline"
                                                    className="upload-file__icon"
                                                    style={{ fontSize: "24px", marginRight: "5px" }}
                                                ></ion-icon>
                                                Upload File
                                            </button>
                                        </div>
                                        {errors.correctAnswer && (
                                            <span className="error_question">
                                                {errors.correctAnswer}
                                            </span>
                                        )}
                                    </div>
                                    {/*  */}
                                    <div className="model1__input">
                                        <label className="modal1__label">
                                            Đáp án sai 1: <br />
                                            <textarea
                                                name="wrongAnswer1"
                                                value={formData.wrongAnswer1}
                                                onChange={handleChange}
                                                className="input__input"
                                                placeholder="Nhập đáp sai 1"
                                            />
                                        </label>
                                        <div className="upload-file">
                                            <input type="file" className="upload-file__input" />
                                            <button className="upload-file__button">
                                                <ion-icon
                                                    name="cloud-upload-outline"
                                                    className="upload-file__icon"
                                                    style={{ fontSize: "24px", marginRight: "5px" }}
                                                ></ion-icon>
                                                Upload File
                                            </button>
                                        </div>
                                        {errors.wrongAnswer1 && (
                                            <span className="error_question">
                                                {errors.wrongAnswer1}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* in1 */}
                                <div className="model1__second">
                                    <div className="model1__input">
                                        <label className="modal1__label">
                                            Đáp án sai 2: <br />
                                            <textarea
                                                name="wrongAnswer2"
                                                value={formData.wrongAnswer2}
                                                onChange={handleChange}
                                                className="input__input"
                                                placeholder="Nhập đáp sai 1"
                                            />
                                        </label>
                                        <div className="upload-file">
                                            <input type="file" className="upload-file__input" />
                                            <button className="upload-file__button">
                                                <ion-icon
                                                    name="cloud-upload-outline"
                                                    className="upload-file__icon"
                                                    style={{ fontSize: "24px", marginRight: "5px" }}
                                                ></ion-icon>
                                                Upload File
                                            </button>
                                        </div>
                                        {errors.wrongAnswer2 && (
                                            <span className="error_question">
                                                {errors.wrongAnswer2}
                                            </span>
                                        )}
                                    </div>
                                    {/*  */}
                                    <div className="model1__input">
                                        <label className="modal1__label">
                                            Đáp án sai 3: <br />
                                            <textarea
                                                name="wrongAnswer3"
                                                value={formData.wrongAnswer3}
                                                onChange={handleChange}
                                                className="input__input"
                                                placeholder="Nhập đáp sai 1"
                                            />
                                        </label>
                                        <div className="upload-file">
                                            <input type="file" className="upload-file__input" />
                                            <button className="upload-file__button">
                                                <ion-icon
                                                    name="cloud-upload-outline"
                                                    className="upload-file__icon"
                                                    style={{ fontSize: "24px", marginRight: "5px" }}
                                                ></ion-icon>
                                                Upload File
                                            </button>
                                        </div>
                                        {errors.wrongAnswer3 && (
                                            <span className="error_question">
                                                {errors.wrongAnswer3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="modal1__button">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="modal1__button-close"
                                    >
                                        Đóng
                                    </button>
                                    <button type="submit" className="modal1__button-add">
                                        Thêm
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <Notification
                notifications={notifications}
                clearNotifications={clearNotifications}
            />
        </div>
    );
};

export default QuestionDetail;
