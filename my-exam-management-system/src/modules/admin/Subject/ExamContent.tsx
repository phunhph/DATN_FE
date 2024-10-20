import { Notification, PageTitle, Table, UploadFile } from "@/components";
import { ExamContentCreate, ExamContentInterface } from "@/interfaces/ExamContentInterface/ExamContentInterface";
import { ErrorSubject } from "@/interfaces/SubjectInterface/ErrorExamSubjectInterface";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ExamContent: React.FC = () => {
  const location = useLocation();
  const { subject } = location.state || {};
  console.log("Subject data:", subject);

  const downloadSample = () => {
    const link = document.createElement("a");
    link.href = `public/excel/Exam-Content.xlsx`;
    link.download = "Exam-Content.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [modalType, setModalType] = useState<"add" | "edit" | "file">("add");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorSubject>({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ExamContentInterface>({
    id: "",
    Name: "",
    Status: true,
  });

  const openModal = (type: "add" | "edit" | "file") => {
    setModalType(type);
    setModalIsOpen(true);
    setErrors({});
    if (!editMode) {
      setFormData({
        id: "",
        Name: "",
        Status: true,
      });
    }
  };

  const openEditModal = (data: ExamContentInterface) => {
    setFormData({
      id: data.id,
      Name: data.Name,
      Status: data.Status,
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
        Status: true,
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

  const createExamContent = () => {
    const newContent: ExamContentInterface = {
      id: formData.id,
      Name: formData.Name,
      Status: true,
    };

    setExamContent([...examContent, newContent]);

    addNotification("Thêm mới môn thi thành công!", true);

    closeModal();
  };

  const handleUpdateSubject = () => {
    setExamContent((prevContents) =>
      prevContents.map((content) =>
        content.id === formData.id ? { ...formData } : content
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
        createExamContent();
      }
      setFormData({
        id: "",
        Name: "",
        Status: true,
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

   const handleUpdateStatus = (id: string) => {
     setExamContent((prevContents) =>
       prevContents.map((content) =>
         content.id === id ? { ...content, Status: !content.Status } : content
       )
     );
     addNotification(`Trạng thái của môn thi đã được thay đổi.`, true);
   };

   const handleStatusChange = (id: string) => {
     if (confirm("Are you sure you want to change the status?")) {
       handleUpdateStatus(id);
     }
   };

  const [examContent, setExamContent] = useState<ExamContentInterface[]>([]);

  useEffect(() => {
    if (subject) {
      const content = [
        {
          id: subject.id,
          Name: subject.Name,
          Status: subject.Status,
        },
      ];
      setExamContent(content);
    }
  }, [subject]);

  return (
    <div className="examContent__container">
      <PageTitle theme="light" showBack={true}>Quản lý nội dung thi</PageTitle>
      <Table
        tableName={`Nội dung thi của môn ${subject?.Name || ""}`}
        data={examContent}
        actions_add={{ name: "Thêm mới", onClick: () => openModal("add") }}
        actions_edit={{
          name: "Chỉnh sửa",
          onClick: (content: any) => {
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
