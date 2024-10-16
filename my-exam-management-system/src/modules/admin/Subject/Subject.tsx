import React, { useEffect, useState } from "react";
import "./Subject.scss";
import {
  Notification,
  PageTitle,
  Table,
  UploadFile,
} from "../../../components";
import { Exam } from "../../../interfaces/ExamInterface/ExamInterface";
import { ExamSubject } from "../../../interfaces/SubjectInterface/ExamSubjectInterface";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { ErrorSubject } from "@/interfaces/SubjectInterface/ErrorExamSubjectInterface";

const Subject: React.FC = () => {
  const [selectedExamId, setSelectedExamId] = useState<string>("");

  const [exams, setExams] = useState<Exam[]>([
    {
      id: 1,
      Name: "Kỳ thi Bảy viên ngọc rồng",
      TimeStart: "2024-06-01",
      TimeEnd: "2024-06-03",
      Status: "active",
    },
    {
      id: 2,
      Name: "Kỳ thi Thuỷ thủ mặt trăng",
      TimeStart: "2024-06-01",
      TimeEnd: "2024-06-03",
      Status: "active",
    },
  ]);

  const [examSubjects, setExamSubject] = useState<ExamSubject[]>([
    {
      id: 1,
      Name: "Môn thi này khó",
      Status: "active",
    },
    {
      id: 2,
      Name: "Môn thi này khó hơn",
      Status: "active",
    },
  ]);

  const examOptions = exams.map((exam) => ({
    label: exam.Name,
    value: exam.id,
  }));
  const firstOption = examOptions[0];

  useEffect(() => {
    if (firstOption) {
      setSelectedExamId(firstOption.value);
    }
  }, [firstOption]);

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
    link.href = `public/excel/Exam-Subject.xlsx`;
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

  const handleStatusChange = (id: string) => {
    if (confirm("Are you sure you want to change the status?")) {
      handleUpdateStatus(id);
    }
  };

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState<ExamSubject>({
    id: "",
    Name: "",
  });

  const openAddModal = () => {
    setModalType("add");
    setEditMode(false);
    setFormData({
      id: "",
      Name: "",
    });
    setModalIsOpen(true);
  };

  const openEditModal = (data: ExamSubject) => {
    setFormData({
      id: data.id,
      Name: data.Name,
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
    if (!formData.Name) errors.name = "Tên môn thi không được để trống.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      if (editMode) {
        handleUpdateSubject();
      } else {
        handleCreateSubject();
      }
      closeModal();
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
      addNotification(data.warning || data.message || "", data.success);
    }
  };

  const handleDetailClick = (exam:ExamSubject) => {
    console.log("Dữ liệu môn thi:", exam);
    console.log("Tên môn:", exam.id);
    console.log("Tên môn:", exam.Name);
    console.log("Trạng thái:", exam.Status);
  };

  return (
    <div className="subject__container">
      <PageTitle theme="light">Quản lý phòng thi</PageTitle>

      <div className="subject__exam">
        <h2>Quản lý kỳ thi</h2>
        <AsyncSelect
          cacheOptions
          loadOptions={loadSemesterOptions}
          defaultOptions={examOptions}
          value={examOptions.find((option) => option.value === selectedExamId)}
          onChange={(selectedOption) => {
            setSelectedExamId(selectedOption?.value || "");
          }}
        />
      </div>

      <Table
        tableName="Môn thi"
        data={examSubjects}
        actions_add={{ name: "Thêm mới", onClick: openAddModal }}
        actions_edit={{
          name: "Chỉnh sửa",
          onClick: (exam) => {
            console.log("Edit",exam);
            
            if (exam) {
              openEditModal(exam);
            }
          },
        }}
        actions_detail={{
          name: "Chi tiết",
          onClick: (exam) => {
            console.log("Detail", exam);
            handleDetailClick(exam);
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
        <div className="modal">
          <div className="modal__overlay">
            <div className="modal__content">
              <button className="modal__close" onClick={closeModal}>
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
                <UploadFile onFileSelect={handleFileChange} />
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
                      {errors.id && <p className="error">{errors.id}</p>}
                    </label>
                    <label className="modal__label">
                      Tên môn thi: <br />
                      <input
                        type="text"
                        name="Name"
                        className="modal__input"
                        value={formData.Name}
                        onChange={handleChange}
                        placeholder="Nhập tên môn thi"
                      />
                      {errors.name && <p className="error">{errors.name}</p>}
                    </label>
                  </div>
                  <div className="modal__button">
                    <button type="submit" className="modal__button-add">
                      {editMode ? "Cập nhật" : "Thêm mới"}
                    </button>
                    <button
                      type="button"
                      className="modal__cancel"
                      onClick={closeModal}
                    >
                      Huỷ bỏ
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

export default Subject;
