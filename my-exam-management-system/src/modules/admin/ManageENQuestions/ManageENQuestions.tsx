import React, { useRef, useState, useEffect } from "react";
import "./ManageENQuestions.scss";
import { Table } from "../../../components";
import { useNavigate } from "react-router-dom";

interface ErrorQuestions {
    [key: string]: string;
}

interface formDataQuestion {
    id: string;
    questionLevel: string;
    questionContent: string;
    correctAnswer: string;
    fileQuestionContent: File | null;
    wrongAnswer1: string;
    wrongAnswer2: string;
    wrongAnswer3: string;
    fileCorrectAnswer: File | null;
    fileWrongAnswer1: File | null;
    fileWrongAnswer2: File | null;
    fileWrongAnswer3: File | null;
}

interface DataQuestion {
    id: string;
    QuestionContent: string;
    status: boolean;
}

const ManageENQuestions = () => {
    const [errors, setErrors] = useState<ErrorQuestions>({});
    const [editMode, setEditMode] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit" | "file" | string>(
        "add"
    );
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
    const [fileName, setFileName] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [dataHardCode, setDataHardCode] = useState<DataQuestion[]>([
        { id: "QS1", QuestionContent: "Câu hỏi 1", status: true },
        { id: "QS2", QuestionContent: "Câu hỏi 2", status: false },
        { id: "QS3", QuestionContent: "Câu hỏi 3", status: false },
    ]);
    const [kythi, setKythi] = useState([
        { id: "kt01", name: "Kythi1" },
        { id: "kt02", name: "Kythi2" },
        { id: "kt03", name: "Kythi3" },
        { id: "kt04", name: "Kythi4" },
        { id: "kt05", name: "Kythi5" },
    ]);
    const [monthi, setMonthi] = useState([
        { id: "mt01", id_kt: "kt01", name: "Mon1" },
        { id: "mt02", id_kt: "kt02", name: "Mon2" },
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        // Update môn thi khi kỳ thi thay đổi
        if (kythi.length > 0) {
            const filteredMonThi = monthi.filter((mon) => mon.id_kt === kythi[0].id);
            setMonthi(filteredMonThi);
        }
    }, [kythi]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setFileName(file.name);
            console.log(file);
        }
    };

    const openModal = (type: "add" | "edit" | "file" | string) => {
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
    }; const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const detailQuestion = (id: string) => {
        navigate(`/admin/detail-questions?&macauhoi=${encodeURIComponent(id)}`);
    };

    const handleKythiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedKythiId = e.target.value;

        // Cập nhật danh sách môn thi theo kỳ thi được chọn
        const filteredMonThi = monthi.filter((mon) => mon.id_kt === selectedKythiId);
        setMonthi(filteredMonThi);

        // Cập nhật kỳ thi đã chọn
        setKythi((prev) =>
            prev.map((kt) =>
                kt.id === selectedKythiId ? { ...kt, selected: true } : { ...kt, selected: false }
            )
        );
    };

    const download = () => {
        alert("Downloading...");
    };

    const handlestatusChange = (id: string) => {
        const updatedData = dataHardCode.map((item) =>
            item.id === id ? { ...item, status: !item.status } : item
        );
        setDataHardCode(updatedData);
    };

    return (
        <div className="QuestionsEN__container">
            <div className="QuestionsEN__title">
                <h1>Quản lý câu hỏi Tiếng Anh</h1>
            </div>
            <div className="QuestionsEN__search">
                <div className="searchEN__title">
                    <p>Thông tin tìm kiếm</p>
                    <div className="filter__select">
                        <p>Danh mục kỳ thi</p>
                        <select className="subject__select" onChange={handleKythiChange}>
                            {kythi.map((kt) => (
                                <option key={kt.id} value={kt.id}>
                                    {kt.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter__select">
                        <p>Danh mục môn thi</p>
                        <select className="subject__select">
                            {monthi.map((mon) => (
                                <option key={mon.id} value={mon.id}>
                                    {mon.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="subject__subject">
                <Table
                    tableName="Exam Table"
                    data={dataHardCode}
                    actions_add={{ name: "Add Exam", onClick: () => openModal("add") }}
                    actions_detail={{
                        name: "chitiet",
                        onClick: () => detailQuestion("file"),
                    }}
                    action_upload={{
                        name: "Upload file",
                        onClick: () => openModal("file"),
                    }}
                    action_dowload={{ name: "Download", onClick: download }}
                    action_status={handlestatusChange}
                />
            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
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
                                    <p>Chọn file từ máy tính của bạn.</p>
                                    <div className="file-upload-container">
                                        <input
                                            type="text"
                                            className="file-input"
                                            value={fileName || "Chưa chọn file"}
                                            readOnly
                                            placeholder="Chưa chọn file"
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
                                // Form xử lý câu hỏi
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
        </div>
    );
};

export default ManageENQuestions;
