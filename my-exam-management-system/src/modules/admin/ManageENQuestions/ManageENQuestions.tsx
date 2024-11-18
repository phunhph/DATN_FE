import React, { useRef, useState, useEffect } from "react";
import "./ManageENQuestions.scss";
import { Notification, Table } from "../../../components";
import { useNavigate } from "react-router-dom";
import { Semester } from "@/interfaces/SemesterInterface/SemestertInterface";
import { ExamSubject } from "@/interfaces/SubjectInterface/ExamSubjectInterface";
import { getAllSemesterWithExamSubject } from "@/services/repositories/SemesterServices/SemesterServices";
import { getAllExamSubjectByIdSemesterWithContent } from "@/services/repositories/ExamSubjectService/ExamSubjectService";
import { getAllQuestionByIdContent } from "@/services/repositories/QuestionServices/QuestionServices";
import { getAllExamContentByIdSubject } from "@/services/repositories/ExamContentService/ExamContentService";
import { ExamContentInterface } from "@/interfaces/ExamContentInterface/ExamContentInterface";

interface ErrorQuestions {
  [key: string]: string;
}

interface DataQuestion {
  id: string;
  content_exam_id: string;
  QuestionContent: string;
  status: boolean;
}

const ManageENQuestions = () => {
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

  const download = () => {
    alert("Downloading...");
  };
  const handlestatusChange = (id: string) => {
    const updatedData = dataHardCode.map((item) =>
      item.id === id ? { ...item, status: !item.status } : item
    );
  };

  const detailQuestion = (id: string) => {
    navigate(`/admin/detail-questions?&macauhoi=${encodeURIComponent(id)}`);
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

          const { id, exam_content_id, status, current_version } = dataItem as {
            id: string;
            exam_content_id: string;
            status: boolean;
            current_version: { Title: string };
          };

          const question: DataQuestion = {
            id: id,
            content_exam_id: exam_content_id,
            QuestionContent: current_version?.Title || "",
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

    console.log(e.target.value);
  };

  const handleOnChange_Context = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setContent(e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    onLoad();
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
      <div className="subject__subject">
        <Table
          title={title}
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
      <Notification
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
    </div>
  );
};

export default ManageENQuestions;
