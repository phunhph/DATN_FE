import { useEffect, useState } from "react";
import "./QuestionDetail.scss";
import { Button, Notification } from "../../../components";
import { useLocation } from "react-router-dom";
import { getQuestionById, updateQuestion } from "@/services/repositories/QuestionServices/QuestionServices";
import {
    Question,
    QuestionDetailResponse,
} from "@/interfaces/QuestionInterface/QuestionInterface";
import { applyTheme } from "@/SCSS/applyTheme";
import { useAdminAuth } from "@/hooks";

interface answer {
    current_version_id: string;
    created_at: string;
    level: string;
}

const QuestionDetail = () => {
    applyTheme()
    useAdminAuth();

    const [questions, setQuestions] = useState<Question>();
    const [answer, setAnswer] = useState<answer[]>([]);
    const location = useLocation();
    const { id, content } = location.state || {};

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
                    exam_content_id: e.exam_content_id ?? content,
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

    const [formData, setFormData] = useState<Question>({
        id: "",
        title: "",
        exam_content_id: "",
        answer_P: "",
        answer_F1: "",
        answer_F2: "",
        answer_F3: "",
        level: "easy",
        image_title: null,
        image_P: null,
        image_F1: null,
        image_F2: null,
        image_F3: null,
    });

    const [modalType, setModalType] = useState<
        "add" | "edit" | "file" | string | undefined
    >("add");

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
        setFormData({
            id: questions?.id ?? '',
            title: questions?.title ?? '',
            exam_content_id: questions?.exam_content_id ?? '',
            answer_P: questions?.answer_P ?? '',
            answer_F1: questions?.answer_F1 ?? '',
            answer_F2: questions?.answer_F2 ?? '',
            answer_F3: questions?.answer_F3 ?? '',
            level: questions?.level ?? 'easy',
            image_title: questions?.image_title ?? null,
            image_P: questions?.image_P ?? null,
            image_F1: questions?.image_F1 ?? null,
            image_F2: questions?.image_F2 ?? null,
            image_F3: questions?.image_F3 ?? null,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            console.log(formData);

            handleUpdateQuestion(formData);
            closeModal();
        }
    };

    const handleUpdateQuestion = async (question: Question) => {
        const result = await updateQuestion(question);
        if (result) {
            console.log(result);
            //  cập nhập dữ liệu cho questions và answer
            addNotification("Thêm mới thành ", result.success)
        }

        addNotification("Thêm mưới thất", result.success)
    }

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
        // if (!formData.id) errors.id = "Mã câu hỏi không được để trống.";
        // if (!formData.level)
        //     errors.questionLevel = "Mức độ câu hỏi không được để trống.";
        if (!formData.title)
            errors.questionContent = "Nội dung câu hỏi không được để trống.";
        if (!formData.answer_P)
            errors.correctAnswer = "Đáp án đúng không được để trống.";
        if (!formData.answer_F1)
            errors.wrongAnswer1 = "Đáp án sai 1 không được để trống.";
        if (!formData.answer_F2)
            errors.wrongAnswer2 = "Đáp án sai 2 không được để trống.";
        if (!formData.answer_F3)
            errors.wrongAnswer3 = "Đáp án sai 3 không được để trống.";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };



    return (
        <div className="Questions__detail__container">
            <div className="Questions__detail__title">
                <h1>Chi tiết câu hỏi</h1>
            </div>
            <div className="ak1j32">
                {/* Hiển thị chi tiết thông tin câu hỏi */}
                <div className="detail_question">
                    <h3>
                        Mã câu hỏi: <span>{questions?.id}</span>
                    </h3>
                    <h3 style={{color:"black"}}>
                        Nội dung câu hỏi: <span>{questions?.title}</span>
                    </h3>
                    <h5 style={{marginTop:"4px"}}>
                        Đáp án đúng: <span>{questions?.answer_P}</span>
                    </h5>
                    <h5 style={{marginTop:"4px"}}>
                        Đáp án sai 1: <span>{questions?.answer_F1}</span>
                    </h5>
                    <h5 style={{marginTop:"4px"}}>
                        Đáp án sai 2: <span>{questions?.answer_F2}</span>
                    </h5>
                    <h5 style={{marginTop:"4px"}}>
                        Đáp án sai 3: <span>{questions?.answer_F3}</span>
                    </h5>
                    <Button className="" style={{color:"white", marginTop:"1rem"}} onClick={openEdit}>
                        Sửa
                    </Button>
                </div>
                {/* Hiển thị thông tin bảng so sánh các phiên bản */}
                <div className="question_active">
                    <h3>Bảng so sánh các phiên bản</h3>
                    <table className="version_table">
                        <thead>
                            <tr>
                                <th>Phiên bản</th>
                                {/* <th>Mức độ</th> */}
                                <th>Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {answer.map((item, index) => (
                                <tr key={index}>
                                    <td>{item?.current_version_id}</td>
                                    {/* <td>{item?.level}</td> */}
                                    <td>
                                        {new Date(item?.created_at || "").toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {modalIsOpen && (
                <div className="modal1">
                    <div className="modal1__overlay" style={{zIndex:"999"}}>
                        <div className="modal1__content" style={{height:"80%", maxHeight:"560px"}}>
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

                                    {/* <label className="modal1__label">
                                        Mức độ câu hỏi: <br />
                                        <select
                                            name="questionLevel"
                                            value={formData.level}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    level: e.target.value,
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
                                    </label> */}
                                </div>
                                <div className="model1__question">
                                    <label className="modal1__label">
                                        Nội dung câu hỏi: <br />
                                        <textarea
                                            name="questionContent"
                                            value={formData.title}
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
                                    {/* <div className="upload-file">
                                        <input type="file" className="upload-file__input" />
                                        <button className="upload-file__button">
                                            <ion-icon
                                                name="cloud-upload-outline"
                                                className="upload-file__icon"
                                                style={{ fontSize: "24px", marginRight: "5px" }}
                                            ></ion-icon>
                                            Upload File
                                        </button>
                                    </div> */}
                                </div>

                                <div className="model1__second">
                                    <div className="model1__input">
                                        <label className="modal1__label">
                                            Đáp án đúng: <br />
                                            <textarea
                                                name="correctAnswer"
                                                onChange={handleChange}
                                                value={formData.answer_P}
                                                className="input__input"
                                                placeholder="Nhận đáp án đúng"
                                            />
                                        </label>
                                        {/* <div className="upload-file">
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
                                        )} */}
                                    </div>
                                    {/*  */}
                                    <div className="model1__input">
                                        <label className="modal1__label">
                                            Đáp án sai 1: <br />
                                            <textarea
                                                name="wrongAnswer1"
                                                value={formData.answer_F1}
                                                onChange={handleChange}
                                                className="input__input"
                                                placeholder="Nhập đáp sai 1"
                                            />
                                        </label>
                                        {/* <div className="upload-file">
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
                                        )} */}
                                    </div>
                                </div>
                                {/* in1 */}
                                <div className="model1__second">
                                    <div className="model1__input">
                                        <label className="modal1__label">
                                            Đáp án sai 2: <br />
                                            <textarea
                                                name="wrongAnswer2"
                                                value={formData.answer_F2}
                                                onChange={handleChange}
                                                className="input__input"
                                                placeholder="Nhập đáp sai 1"
                                            />
                                        </label>
                                        {/* <div className="upload-file">
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
                                        )} */}
                                    </div>
                                    {/*  */}
                                    <div className="model1__input">
                                        <label className="modal1__label">
                                            Đáp án sai 3: <br />
                                            <textarea
                                                name="wrongAnswer3"
                                                value={formData.answer_F3}
                                                onChange={handleChange}
                                                className="input__input"
                                                placeholder="Nhập đáp sai 1"
                                            />
                                        </label>
                                        {/* <div className="upload-file">
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
                                        )} */}
                                    </div>
                                </div>
                                <div className="modal1__button">
                                    <Button
                                        type="button"
                                        onClick={closeModal}
                                        style={{marginRight:"1rem", color:"white"}}
                                    >
                                        Đóng
                                    </Button>
                                    <Button type="submit" style={{color:"white"}}>
                                        Thêm
                                    </Button>
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
