import { Button, Notification, PageTitle, Table, UploadFile } from "@/components";
import { useAdminAuth } from "@/hooks";
import {
  ExamContentCreate,
  ExamContentInterface,
} from "@/interfaces/ExamContentInterface/ExamContentInterface";
import { ErrorSubject } from "@/interfaces/SubjectInterface/ErrorExamSubjectInterface";
import {applyTheme} from "@/SCSS/applyTheme";
import {
  addExamContent,
  getAllExamContentByIdSubject,
  importFileExcelContent,
  updateExamContent,
} from "@/services/repositories/ExamContentService/ExamContentService";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ExamContent: React.FC = () => {
  useAdminAuth();
  applyTheme()

  const location = useLocation();
  const { subject } = location.state || {};

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
    title: "",

    url_listening: "",
    description: "",
    status: true,
  });

  const openModal = (type: "add" | "edit" | "file") => {
    setModalType(type);
    setModalIsOpen(true);
    setErrors({});
    if (type === "add") {
      setEditMode(false);
    }
    if (!editMode) {
      setFormData({
        id: "",
        title: "",

        url_listening: "",
        description: "",
        status: true,
      });
    }
  };

  const title = [
    "Mã nội dung thi",
    "Tên nội dung thi",
    "URL Audio bài nghe",
    "Bài đọc",
    "Trạng thái",
    "Thao tác",
  ];

  const openEditModal = (data: ExamContentInterface) => {
    setFormData({
      id: data.id,
      title: data.title,

      url_listening: data.url_listening,
      description: data.description,
      status: data.status,
    });
    setEditMode(true);
    setModalType("edit");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditMode(false);
    if (!editMode) {
      setFormData({
        id: "",
        title: "",

        url_listening: "",
        description: "",
        status: true,
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

      addNotification(data.message || "", data.success);
    }
  };

  const validate = (): boolean => {
    const errors: ErrorSubject = {};
    if (!formData.id) errors.id = "Mã không được để trống.";
    if (!formData.title) errors.name = "Tên không được để trống.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createExamContent = async () => {
    const newContent: ExamContentCreate = {
      exam_subject_id: subject.id,
      id: formData.id,
      title: formData.title,

      url_listening: formData.url_listening,
      description: formData.description,
      status: true,
    };

    const result = await addExamContent(newContent);
    if (result.success) {
      setExamContent([...examContent, newContent]);
    }

    addNotification(result.message, result.success);

    closeModal();
  };

  const handleUpdateSubject = async () => {
    console.log("formData", formData);
    const result = await updateExamContent(formData);
    if (result.success) {
      setExamContent((prevContents) =>
        prevContents.map((content) =>
          content.id === formData.id ? { ...formData } : content
        )
      );
    }
    addNotification(result.message, result.success);
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
        title: "",

        url_listening: "",
        description: "",
        status: true,
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
       content.id === id ? { ...content, status: !content.status } : content
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

  const formatDataSubject = (
    data: ExamContentInterface[] | ExamContentInterface
  ) => {
    if (Array.isArray(data)) {
      return data.map((e) => ({
        id: e.id,
        title: e.title,

        url_listening: e.url_listening,
        description: e.description,
        status: e.status,
      }));
    } else if (data && typeof data === "object") {
      return [
        {
          id: data.id,
          title: data.title,

          url_listening: data.url_listening,
          description: data.description,
          status: data.status,
        },
      ];
    }

    return [];
  };
  const onload = async () => {
    const result = await getAllExamContentByIdSubject(subject.id);
    if (result.success) {
      const data = formatDataSubject(result.data);
      setExamContent(data);
      console.log(data);
    }
  };
  useEffect(() => {
    if (subject) {
      onload();
    }
  }, [subject]);

  

  return (
    <div className="examContent__container">
      <PageTitle theme="light" showBack={true}>
        Quản lý nội dung thi
      </PageTitle>
      <Table
        title={title}
        tableName={`Nội dung thi của môn ${subject?.name || ""}`}
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
            <div className="modal__content" style={{width:"700px"}}>
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
                        name="title"
                        className="modal__input"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Nhập tên"
                      />
                      {errors.name && <p className="error">{errors.name}</p>}
                    </label>
                    <label className="modal__label">
                      URL bài nghe: <br />
                      <input
                        type="text"
                        name="url_listening"
                        className="modal__input"
                        value={formData.url_listening}
                        onChange={handleChange}
                        placeholder="Nhập URL bài nghe"
                      />
                    </label>
                    <label className="modal__label">
                      Nội dung bài đọc: <br />
                      <textarea
                        name="description"
                        className="modal__input"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Nhập nội dung bài đọc"
                        style={{resize:"none", height:"100px"}}
                      />
                    </label>
                  </div>

                  <div className="modal__button" style={{paddingBottom:"1rem"}}>
                    <Button type="submit" style={{color:"white", marginRight:"1rem"}}>
                      {editMode ? "Cập nhật" : "Thêm mới"}
                    </Button>
                    <Button
                      type="button"
                      onClick={closeModal}
                      style={{color:"white"}}
                    >
                      Đóng
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

export default ExamContent;
