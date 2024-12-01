import React, { useRef, useState, useEffect } from "react";
import "./ManageENQuestions.scss";
import { Notification, Table } from "../../../components";
import { useNavigate } from "react-router-dom";
import { Semester } from "@/interfaces/SemesterInterface/SemestertInterface";
import { ExamSubject } from "@/interfaces/SubjectInterface/ExamSubjectInterface";
import { getAllSemesterWithExamSubject } from "@/services/repositories/SemesterServices/SemesterServices";
import { getAllExamSubjectByIdSemesterWithContent } from "@/services/repositories/ExamSubjectService/ExamSubjectService";
import { createQuestion, getAllQuestionByIdContent } from "@/services/repositories/QuestionServices/QuestionServices";
import { getAllExamContentByIdSubject } from "@/services/repositories/ExamContentService/ExamContentService";
import { ExamContentInterface } from "@/interfaces/ExamContentInterface/ExamContentInterface";
import { Question } from "@/interfaces/QuestionInterface/QuestionInterface";

interface ErrorQuestions {
  [key: string]: string;
}

interface DataQuestion {
  id: string;
  title: string;
  status: boolean;
}

const ManageENQuestions = () => {
  const [editMode, setEditMode] = useState(false);
  const [kyThi, setKyThi] = useState("");
  const [semester, setSemester] = useState<Semester[]>([]);
  const [monThi, setMonThi] = useState("");
  const [examContent, setExamContent] = useState<ExamContentInterface[]>([]);
  const [content, setContent] = useState("");
  const [examSubjects, setExamSubject] = useState<ExamSubject[]>([]);
  const [errors, setErrors] = useState<ErrorQuestions>({});
  const [dataHardCode, setDataHardCode] = useState<DataQuestion[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "file" | string>(
    "add"
  );
  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);
  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };
  const clearNotifications = () => {
    setNotifications([]);
  };
  const title = ["Mã câu hỏi", "Nội dung", "Trạng thái", "Thao tác"];

  const [formData, setFormData] = useState<Question>({
    id: "",
    exam_content_id: content,
    title: "",
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
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

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
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const validate = (): boolean => {
    const errors: ErrorQuestions = {};
    if (!formData.id) errors.id = "Mã câu hỏi không được để trống.";
    if (!formData.level)
      errors.questionLevel = "Mức độ câu hỏi không được để trống.";
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

  const createQuestion_ = async (formData: Question) => {
    formData.level = "easy";
    const result = await createQuestion(formData)
    if (result.success && result.data) {
      console.log(result.data);

      const data: DataQuestion = {
        id: result.data.id,
        title: result.data.title,
        status: result.data.status,
      }
      setDataHardCode([...dataHardCode, data])

    }
    addNotification(result.message, result.success);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      console.log(formData);
      formData.exam_content_id = content
      if (editMode) {
        alert("Cập nhật câu hỏi thành công!");
      } else {
        createQuestion_(formData)

      }
      setFormData({
        id: "",
        exam_content_id: content,
        title: "",
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

  const download = () => {
    alert("Downloading...");
  };
  const handlestatusChange = (id: string) => {
    const updatedData = dataHardCode.map((item) =>
      item.id === id ? { ...item, status: !item.status } : item
    );
  };

  const detailQuestion = (id: string) => {
    console.log(id);

    navigate(`/admin/detail-questions`, { state: { id, content } });
  };

  const onLoad = async () => {
    try {
      const data = await getAllSemesterWithExamSubject();

      if (!data.success || !data.data) {
        throw new Error("Failed to get exams.");
      }

      setSemester(data.data);
      if (data.data.length === 0 || !data.data[0].id) {
        throw new Error("No valid exams found.");
      }

      const examId = String(data.data[0].id);
      setKyThi(examId);

      const subjects = await getSubjectsByIdExam(examId);
      if (subjects.success) {
        const subjectId = String(subjects.data[0].id);
        getAllExamContent(subjectId);
      }
    } catch (error) {
      console.error("Error in dataStart:", error);
    }
  };

  const getAllExamContent = async (id: string) => {
    const result = await getAllExamContentByIdSubject(id);
    if (result.success) {
      const data = formatDataSubject(result.data);
      setExamContent(data);
      setContent(data[0].id as string);
      getQuestionByIdContent(data[0].id as string);
    } else {
      setExamContent([]);
    }
  };

  const formatDataQuestion = (data: unknown): DataQuestion[] => {
    if (Array.isArray(data)) {
      const formattedData: DataQuestion[] = [];

      data.forEach((dataItem: unknown) => {
        if (typeof dataItem === "object" && dataItem !== null) {
          console.log(dataItem);

          const { id, status, title } = dataItem as {
            id: string;
            status: boolean;
            title: string;
          };

          const question: DataQuestion = {
            id: id,
            title: title,
            status: status,
          };

          formattedData.push(question);
        }
      });

      return formattedData;
    } else {
      throw new Error("Data is not an array");
    }
  };

  const getQuestionByIdContent = async (id: string) => {
    const dataSubject = await getAllQuestionByIdContent(id);
    if (dataSubject.success) {
      const data = formatDataQuestion(dataSubject.data);

      setDataHardCode(data);
    } else {
      setDataHardCode([]);
      addNotification(dataSubject.message || "", dataSubject.success);
    }
    return dataSubject;
  };

  const formatDataSubject = (
    data: ExamContentInterface[] | ExamContentInterface
  ) => {
    if (Array.isArray(data)) {
      return data.map((e) => ({
        id: e.id,
        title: e.title,
        status: e.status,
      }));
    } else if (data && typeof data === "object") {
      return [
        {
          id: data.id,
          title: data.title,
          status: data.status,
        },
      ];
    }

    return [];
  };

  const handleOnChange_Exam = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setKyThi(e.target.value);
    await getSubjectsByIdExam(e.target.value);
  };

  const getSubjectsByIdExam = async (id: string) => {
    const dataSubject = await getAllExamSubjectByIdSemesterWithContent(id);
    if (dataSubject.success) {
      const subjectsWithoutId: ExamSubject[] = dataSubject.data;
      const subjectId = String(subjectsWithoutId[0].id);
      setMonThi(subjectId);
      setExamSubject(subjectsWithoutId);
    } else {
      setExamSubject([]);
      setExamContent([]);
    }
    return dataSubject;
  };

  const handleOnChange_Subject = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setMonThi(e.target.value);

    const subjectId = String(e.target.value);
    getAllExamContent(subjectId);

  };

  const handleOnChange_Context = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setContent(e.target.value);
    getQuestionByIdContent(e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    onLoad();
    document.documentElement.className = `admin-light`;
  }, []);

  return (
    <div className="QuestionsEN__container">
      <div className="QuestionsEN__title">
        <h1>Quản lý câu hỏi Tiếng Anh</h1>
      </div>
      <div className="QuestionsEN__search">
        <div className="searchEN__title">
          <p>Thông tin tìm kiếm</p>
          <div className="filter__select">
            <label htmlFor="kyThi">Chọn kỳ thi:</label>
            <select
              className="subject__select"
              id="kyThi"
              value={kyThi}
              onChange={handleOnChange_Exam}
            >
              <option value="">Chọn kỳ thi</option>
              {semester.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
            {errors.kyThi && (
              <span className="error__number">{errors.kyThi}</span>
            )}
          </div>
          <div className="filter__select">
            <label htmlFor="monThi">Chọn môn thi:</label>
            <select
              className="subject__select"
              id="monThi"
              value={monThi}
              onChange={handleOnChange_Subject}
            >
              <option value="">Chọn môn thi</option>
              {examSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {errors.monThi && (
              <span className="error__number">{errors.monThi}</span>
            )}
          </div>
          <div className="filter__select">
            <label htmlFor="monThi">Chọn nội dung môn thi:</label>
            <select
              className="subject__select"
              value={content}
              onChange={handleOnChange_Context}
            >
              <option value="">Chọn nội dung môn thi</option>
              {examContent.map((mon) => (
                <option key={mon.id} value={mon.id}>
                  {mon.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="subject__subjectt">
        <Table
          title={title}
          tableName="Exam Table"
          data={dataHardCode}
          actions_add={{ name: "Add Exam", onClick: () => openModal("add") }}
          actions_detail={{
            name: "Chi tiết",
            onClick: (exam) => {
              if (exam) {
                detailQuestion(exam);
              }
            },
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

                    {/* <label className="modal1__label">
                      Mức độ câu hỏi: <br />
                      <select
                        name="level"
                        value={formData.level}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            level: e.target.value,
                          })
                        }
                        className="subject__select1"
                      >
                        <option value="easy">Dễ</option>
                        <option value="difficult">Trung Bình</option>
                        <option value="medium">Khó</option>
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
                        name="title"
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
                      <input type="file" className="upload-file__input" />ABC
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
                          name="answer_P"
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
                      </div> */}
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
                          name="answer_F1"
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
                      </div> */}
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
                          name="answer_F2"
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
                      </div> */}
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
                          name="answer_F3"
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
                      </div> */}
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

export default ManageENQuestions;
