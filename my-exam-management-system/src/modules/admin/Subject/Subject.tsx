/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./Subject.scss";
import {
  Button,
  Notification,
  PageTitle,
  Table,
  UploadFile,
} from "../../../components";
import {
  ExamSubject,
  SubjectCreate,
} from "../../../interfaces/SubjectInterface/ExamSubjectInterface";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { ErrorSubject } from "@/interfaces/SubjectInterface/ErrorExamSubjectInterface";
import { getAllSemester } from "@/services/repositories/SemesterServices/SemesterServices";
import { SemesterType } from "../ManageSemester/Semester.type";
import {
  addExamSubject,
  getAllExamSubjectByIdSemester,
  importFileExcel,
  importExcelSubjects,
  exportExcelSubjects,
} from "@/services/repositories/ExamSubjectService/ExamSubjectService";
import { Semester } from "@/interfaces/SemesterInterface/SemestertInterface";
import { applyTheme } from "@/SCSS/applyTheme";
import { useAdminAuth } from "@/hooks";

const Subject: React.FC = () => {
  useAdminAuth();
  applyTheme()

  const [selectedExamId, setSelectedExamId] = useState<string>("");

  const [semesters, setSemesters] = useState<SemesterType[]>([]);

  const [examSubjects, setExamSubject] = useState<ExamSubject[]>([]);

  const title = ["Mã ôn thi", "Tên Môn thi", "Trạng thái", "Thao tác"];

  const examOptions = semesters.map((semester) => ({
    label: semester.semesterName,
    value: semester.semesterCode,
  }));
  const firstOption = examOptions[0];

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

  const [modalType, setModalType] = useState<"add" | "edit" | "file">("add");

  const openFileUploadModal = () => {
    setModalType("file");
    setModalIsOpen(true);
  };

  const downloadSample = () => {
    const link = document.createElement("a");
    link.href = `/excel/Exam-Subject.xlsx`;
    link.download = "Exam-Subject.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadSemesterOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    setTimeout(() => {
      callback(
        examOptions.filter((i) =>
          i.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }, 1000);
  };

  const handleCreateSubject = async () => {
    const newSubject: SubjectCreate = {
      id: formData.id,
      exam_id: selectedExamId,
      name: formData.name,
      status: true,
    };

    const result = await addExamSubject(newSubject);
    console.log(result);
    if (result.success === true) {
      setExamSubject([...examSubjects, newSubject]);

      addNotification("Thêm mới môn thi thành công!", true);
    } else {
      addNotification(
        result.message ?? "Thêm mới môn thi thất bại",
        result.success
      );
    }

    closeModal();
  };

  const handleUpdateStatus = (id: string) => {
    setExamSubject((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.id === id ? { ...subject, status: !subject.status } : subject
      )
    );
    addNotification(`Trạng thái của môn thi đã được thay đổi.`, true);
  };

  const handleStatusChange = (id: string) => {
    if (confirm("Are you sure you want to change the status?")) {
      handleUpdateStatus(id);
    }
  };

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState<ExamSubject>({
    id: "",
    name: "",
  });

  const openAddModal = () => {
    setModalType("add");
    setEditMode(false);
    setFormData({
      id: "",
      name: "",
    });
    setModalIsOpen(true);
  };

  const openEditModal = (data: ExamSubject) => {
    setFormData({
      id: data.id,
      name: data.name,
    });
    setEditMode(true);
    setModalType("edit");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const [errors, setErrors] = useState<ErrorSubject>({});

  const validate = (): boolean => {
    const errors: ErrorSubject = {};
    if (!formData.id) errors.id = "Mã môn thi không được để trống.";
    if (!formData.name) errors.name = "Tên môn thi không được để trống.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateSubject = () => {
    console.log(formData);

    setExamSubject((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.id === formData.id ? { ...formData } : subject
      )
    );
    addNotification("Cập nhật môn thi thành công!", true);
    closeModal();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      if (editMode) {
        handleUpdateSubject();
      } else {
        handleCreateSubject();
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = async (file: FormData) => {
    if (file) {
      const data = await importFileExcel(file);
      if (data.success && data.data) {
        console.log(data);
      } else {
        console.error("Failed to create subject:", data.message);
      }
      addNotification(data.message || "", data.success);
    }
  };
  const navigate = useNavigate();
  const handleDetailClick = (id: number | string) => {
    const subject = examSubjects.find((e) => e.id === id);
    if (subject) {
      navigate(`/admin/exam-content`, { state: { subject } });
    } else {
      addNotification("Exam not found", false);
    }
  };

  const formatData = (data: Semester[] | Semester) => {
    if (Array.isArray(data)) {
      return data.map((e) => ({
        semesterName: e.name,
        semesterCode: e.id,
        semesterStart: e.time_start,
        semesterEnd: e.time_end,
        semesterStatus: e.status,
      }));
    } else if (data && typeof data === "object") {
      return [
        {
          semesterName: data.name,
          semesterCode: data.id,
          semesterStart: data.time_end,
          semesterEnd: data.time_start,
          semesterStatus: data.status,
        },
      ];
    }

    return [];
  };

  const getSemester = async () => {
    const data = await getAllSemester();
    if (data.success) {
      const listSemester = formatData(data.data);
      setSemesters(listSemester);
    } else {
      addNotification(data.message ?? "Đã có lỗi xảy ra", data.success);
    }
  };

  const formatDataSubject = (data: ExamSubject[] | ExamSubject) => {
    if (Array.isArray(data)) {
      return data.map((e) => ({
        id: e.id,
        name: e.name,
        status: e.status,
      }));
    } else if (data && typeof data === "object") {
      return [
        {
          id: data.id,
          name: data.name,
          status: data.status,
        },
      ];
    }

    return [];
  };

  const getSubjectsByIdSemester = async (id: string) => {
    const dataSubject = await getAllExamSubjectByIdSemester(id);
    if (dataSubject.success) {
      const data = formatDataSubject(dataSubject.data);
      setExamSubject(data);
    } else {
      setExamSubject([]);
      addNotification(dataSubject.message || "", dataSubject.success);
    }
  };

  useEffect(() => {
    if (firstOption && selectedExamId === "") {
      setSelectedExamId(firstOption.value);
      getSubjectsByIdSemester(firstOption.value);
    }
  }, [firstOption]);

  const onLoad = () => {
    getSemester();
  };

  useEffect(() => {
    onLoad();
  }, []);
  const handleExportAll = async () => {
    try {
      const response = await exportExcelSubjects();
      if (response.success) {
        addNotification("Xuất file Excel thành công", true);
      } else {
        addNotification(response.message || "Xuất file thất bại", false);
      }
    } catch (error) {
      addNotification("Đã xảy ra lỗi khi xuất file", false);
    }
  };

  const handleExportByExam = async () => {
    if (!selectedExamId) {
      addNotification("Vui lòng chọn kỳ thi", false);
      return;
    }
    try {
      const response = await exportExcelSubjects("exam", selectedExamId);
      if (response.success) {
        addNotification("Xuất file Excel thành công", true);
      } else {
        addNotification(response.message || "Xuất file thất bại", false);
      }
    } catch (error) {
      addNotification("Đã xảy ra lỗi khi xuất file", false);
    }
  };

  const handleFileDrop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      addNotification("Vui lòng chọn file", false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await importExcelSubjects(formData);
      if (response.success) {
        addNotification("Import thành công", true);
        if (selectedExamId) {
          getSubjectsByIdSemester(selectedExamId);
        }
        fileInput.value = "";
        closeModal();
      } else {
        addNotification(response.message || "Import thất bại", false);
      }
    } catch (error: any) {
      addNotification(error.message || "Lỗi khi import", false);
    }
  };
  return (
    <div className="subject__container">
      <PageTitle theme="light">Quản lý môn thi</PageTitle>

      <div className="subject__exam">
        <h2>Quản lý kỳ thi</h2>
        <AsyncSelect
          cacheOptions
          loadOptions={loadSemesterOptions}
          defaultOptions={examOptions}
          value={examOptions.find((option) => option.value === selectedExamId)}
          onChange={(selectedOption) => {
            setSelectedExamId(selectedOption?.value || "");
            if (selectedOption?.value) {
              getSubjectsByIdSemester(selectedOption?.value);
            }
          }}
        />
        <div className="subject__actions">
          <Button onClick={handleExportAll}>Xuất tất cả</Button>
          <Button onClick={handleExportByExam}>Xuất theo kỳ thi</Button>

          {/* <form onSubmit={handleFileDrop}>
            <input type="file" accept=".xlsx,.xls" />
            <Button type="submit">Import</Button>
          </form> */}
        </div>
      </div>

      <Table
        title={title}
        tableName="Môn thi"
        data={examSubjects}
        actions_add={{ name: "Thêm mới", onClick: openAddModal }}
        actions_edit={{
          name: "Chỉnh sửa",
          onClick: (exam) => {
            if (exam) {
              openEditModal(exam);
            }
          },
        }}
        actions_detail={{
          name: "Chi tiết",
          onClick: (exam) => {
            console.log(exam);

            if (exam) {
              handleDetailClick(exam);
            }
          },
        }}
        action_upload={{
          name: "Upload file",
          onClick: openFileUploadModal,
        }}
        action_dowload={{ name: "Tải mẫu", onClick: downloadSample }}
        action_status={handleStatusChange}
      />

      {modalIsOpen && (
        <div className="modal2">
          <div className="modal1__overlay">
            <div className="modal1__content">
              <button className="modal1__close" onClick={closeModal}>
                X
              </button>
              <h2 className="modal__title">
                {modalType === "edit"
                  ? "Chỉnh sửa môn thi"
                  : modalType === "file"
                    ? "Tải lên file"
                    : "Thêm mới môn thi"}
              </h2>
              {modalType === "file" ? (
                // <UploadFile onFileSelect={handleFileChange} />
                <form onSubmit={handleFileDrop}>
                  <input
                    id="upload-file-btn"
                    type="file"
                    accept=".xlsx,.xls"
                    className="fileInput Ac7ac"
                  />
                  <Button type="submit" className="export-btn">Gửi</Button>
                </form>
              ) : (
                <form className="modal__form" onSubmit={handleSubmit}>
                  <div className="modal__firstline">
                    <label className="modal__label">
                      Mã môn thi: <br />
                      <input
                        type="text"
                        name="id"
                        className="modal__input"
                        value={formData.id}
                        onChange={handleChange}
                        placeholder="Nhập mã môn thi"
                        readOnly={editMode}
                      />
                      {errors.id && <p className="subject-error">{errors.id}</p>}
                    </label>
                    <label className="modal__label">
                      Tên môn thi: <br />
                      <input
                        type="text"
                        name="name"
                        className="modal__input"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập tên môn thi"
                      />
                      {errors.name && <p className="subject-error">{errors.name}</p>}
                    </label>
                  </div>
                  <div className="modal__button">
                    <Button type="submit" style={{marginRight:"1rem", color:"white"}}>
                      {editMode ? "Cập nhật" : "Thêm mới"}
                    </Button>
                    <Button
                      type="button"
                      onClick={closeModal}
                      style={{color:"white"}}
                    >
                      Huỷ bỏ
                    </Button>
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

export default Subject;
