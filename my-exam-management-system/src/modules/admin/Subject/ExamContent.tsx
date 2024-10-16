import { Notification, PageTitle, Table, UploadFile } from "@/components";
import { ExamContentInterface } from "@/interfaces/ExamContentInterface/ExamContentInterface";
import { ErrorSubject } from "@/interfaces/SubjectInterface/ErrorExamSubjectInterface";
import React, { useState } from "react";

const ExamContent: React.FC = () => {
  const [examContent, setExamContent] = useState<ExamContentInterface[]>([
    {
      id: 1,
      Name: "Nội dung thi 1",
      title: "Tiêu đề 1",
      Status: "active",
    },
    {
      id: 2,
      Name: "Nội dung thi 2",
      title: "Tiêu đề 2",
      Status: "active",
    },
  ]);

  const downloadSample = () => {
    const link = document.createElement("a");
    link.href = `public/excel/Exam-Content.xlsx`;
    link.download = "Exam-Content.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = (id: string) => {
    if (confirm("Are you sure you want to change the status?")) {
      updateStatuContent(id);
    }
  };
  const [modalType, setModalType] = useState<"add" | "edit" | "file">("add");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorSubject>({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ExamContentInterface>({
    id: "",
    Name: "",
    Status: "",
  });

  const openModal = (type: "add" | "edit" | "file") => {
    setModalType(type);
    setModalIsOpen(true);
    setErrors({});
    if (!editMode) {
      setFormData({
        id: "",
        Name: "",
        Status: "true",
      });
    }
  };

  const openEditModal = (data: ExamContentInterface) => {
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
    if (!editMode) {
      setFormData({
        id: "",
        Name: "",
        Status: "",
      });
    }
  };

  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);
  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleFileChange = async (file: FormData) => {
    if (file) {
      const data = await importFileExcelContent(file);

      addNotification(data.warning || data.message || "", data.success);
    }
  };

  const validate = (): boolean => {
    const errors: ErrorSubject = {};
    if (!formData.id) errors.id = "Mã không được để trống.";
    if (!formData.Name) errors.name = "Tên không được để trống.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      if (editMode) {
        handleUpdateSubject();
      } else {
        createExamContent(formData);
      }
      setFormData({
        id: "",
        Name: "",
        Status: "",
      });
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

  return (
    <div className="examContent__container">
      <PageTitle theme="light">Quản lý nội dung thi</PageTitle>
      <Table
        tableName="Nội dung thi"
        data={examContent}
        actions_add={{ name: "Thêm mới", onClick: () => openModal("add") }}
        actions_edit={{
          name: "Chỉnh sửa",
          onClick: (content) => {
            if (content) {
              openEditModal(content);
            }
          },
        }}
        action_upload={{
          name: "Upload file",
          onClick: () => openModal("file"),
        }}
        action_dowload={{ name: "Tải mẫu", onClick: downloadSample }}
        action_status={handleStatusChange}
      ></Table>

      {modalIsOpen && (
        <div className="modal">
          <div className="modal__overlay">
            <div className="modal__content">
              <button className="modal__close" onClick={closeModal}>
                X
              </button>
              <h2 className="modal__title">
                {modalType === "edit"
                  ? "Chỉnh sửa nội dung thi"
                  : modalType === "file"
                  ? "Tải lên file"
                  : "Thêm mới nội dung thi"}
              </h2>
              {modalType === "file" ? (
                <UploadFile onFileSelect={handleFileChange} />
              ) : (
                <form className="modal__form" onSubmit={handleSubmit}>
                  <div className="modal__firstline">
                    <label className="modal__label">
                      Mã: <br />
                      <input
                        type="text"
                        name="id"
                        className="modal__input"
                        value={formData.id}
                        onChange={handleChange}
                        placeholder="Nhập mã"
                        readOnly={editMode}
                      />
                      {errors.id && <p className="error">{errors.id}</p>}
                    </label>

                    <label className="modal__label">
                      Tên: <br />
                      <input
                        type="text"
                        name="Name"
                        className="modal__input"
                        value={formData.Name}
                        onChange={handleChange}
                        placeholder="Nhập tên"
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
                      onClick={closeModal}
                      className="modal__button-close"
                    >
                      Đóng
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

export default ExamContent;
