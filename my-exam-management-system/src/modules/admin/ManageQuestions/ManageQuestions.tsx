import React, { useRef, useState } from "react";
import "./ManageQuestion.scss";
import { useNavigate } from "react-router-dom";
import { Notification, Table } from "../../../components";

const ManageQuestions = () => {
    // useAuth();
    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState<ErrorQuestions>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit" | "file" | string | undefined>("add");
    // const [selectedExamId, setSelectedExamId] = useState<string>("");
    const [notifications, setNotifications] = useState<
        Array<{ message: string; isSuccess: boolean }>
    >([]);
    const addNotification = (message: string, isSuccess: boolean) => {
        setNotifications((prev) => [...prev, { message, isSuccess }]);
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

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
    interface DataQuestion {
        id: string;
        QuestionContent: string;
        status: boolean;
    }

    const [dataHardCode, setDataHardCode] = useState<DataQuestion[]>([
        {
            id: "QS1",
            QuestionContent: "Câu hỏi 1",
            status: true,
        },
        {
            id: "QS2",
            QuestionContent: "Câu hỏi 2",
            status: false,
        },
        {
            id: "QS3",
            QuestionContent: "Câu hỏi 3",
            status: false,
        },
        {
            id: "QS4",
            QuestionContent: "Câu hỏi 4",
            status: true,
        },
        {
            id: "QS5",
            QuestionContent: "Câu hỏi 3",
            status: false,
        },
        {
            id: "QS6",
            QuestionContent: "Câu hỏi 6",
            status: true,
        },
        {
            id: "QS7",
            QuestionContent: "Câu hỏi 7",
            status: false,
        },
        {
            id: "QS8",
            QuestionContent: "Câu hỏi 8",
            status: false,
        },
        {
            id: "QS9",
            QuestionContent: "Câu hỏi 9",
            status: true,
        },
        {
            id: "QS10",
            QuestionContent: "Câu hỏi 10",
            status: false,
        },
    ]);
    const openModal = (type: "add" | "edit" | "file" | string | undefined) => {
        setModalType(type);
        setModalIsOpen(true);
        setErrors({});
        if (type === "add") {
            setEditMode(false);
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
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };
    const [fileName, setFileName] = useState<string>("");
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            console.log(file.name);
        }
    };
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            if (editMode) {
                alert("Cập nhật câu hỏi thành công!");
            } else {
                addNotification("Thêm câu hỏi thành công!", true)
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };


    // Hàm tải xuống file CSV với nội dung từ bảng
    const downloadSample = () => {
        // Chọn bảng từ DOM
        const table = document.querySelector(".subject__table");
        if (!table) return;

        // Trích xuất dữ liệu từ bảng
        let csvContent = "data:text/csv;charset=utf-8,";
        const rows = table.querySelectorAll("tr");

        rows.forEach((row) => {
            const cells = row.querySelectorAll("th, td");
            const rowContent = Array.from(cells)
                .map((cell) => cell.textContent)
                .join(",");
            csvContent += rowContent + "\n";
        });

        // Tạo liên kết và tải xuống file CSV
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "table_data.csv");
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
    };

    const handlestatusChange = (id: string) => {
        alert("status id " + id);
    }

    const navigate = useNavigate();

    const detailQuestion = (id: string) => {
        navigate(`/admin/detail-questions?&macauhoi=${encodeURIComponent(id)}`);
    };

    const download = () => {
        alert("path dowload")
    }

    return (
        <div className="Questions__container">
            <div className="Questions__title">
                <h1>Quản lý câu hỏi</h1>
            </div>
            <div className="Questions__exam">
                <div className="exam__filter">
                    <div className="filter__select">
                        <p>Kì thi</p>
                        <select name="Quản lý kỳ thi" id="" className="subject__select">
                            <option value="" className="subject__option">
                                select 1
                            </option>
                        </select>
                    </div>
                    <div className="filter__select">
                        <p>Môn thi</p>
                        <select name="Quản lý kỳ thi" id="" className="subject__select">
                            <option value="" className="subject__option">
                                select
                            </option>
                        </select>
                    </div>
                    <div className="filter__select">
                        <p>Nội dung thi</p>
                        <select name="Quản lý kỳ thi" id="" className="subject__select">
                            <option value="" className="subject__option">
                                selects
                            </option>
                        </select>
                    </div>
                    <div className="filter__button_div">
                        <button className="filter__button">Lọc</button>
                    </div>
                </div>
            </div>
            <div className="subject__subject">
                <Table
                    tableName="Exam Table"
                    data={dataHardCode}
                    actions_add={{ name: "Add Exam", onClick: () => openModal("add") }}
                    actions_detail={detailQuestion}
                    action_upload={{ name: "Upload file", onClick: () => openModal("file") }}
                    action_dowload={{ name: "Download", onClick: download }}
                    action_status={handlestatusChange}
                />
            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            ></input>
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
                            {modalType === "file" ? (
                                <div className="modal__file-content">
                                    <p>Hãy chọn file từ máy tính của bạn.</p>
                                    <div className="file-upload-container">
                                        <input
                                            type="text"
                                            className="file-input"
                                            value={fileName || "Chưa chọn file"}
                                            readOnly
                                            placeholder="Chưa chọn file"
                                        />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="file-select-button"
                                        >
                                            Chọn file
                                        </button>
                                    </div>
                                </div>
                            ) : (
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
                                                onChange={(e) => setFormData({ ...formData, questionLevel: e.target.value })}
                                                className="subject__select1"
                                            >
                                                <option value="Dễ">Dễ</option>
                                                <option value="Trung bình">Trung Bình</option>
                                                <option value="Khó">Khó</option>
                                            </select>
                                            {errors.questionLevel && (
                                                <span className="error_question">{errors.questionLevel}</span>
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
                            )}
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

export default ManageQuestions;
