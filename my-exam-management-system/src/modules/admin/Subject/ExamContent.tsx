import { Notification, PageTitle, Table, UploadFile } from "@/components";
import { ExamContentCreate, ExamContentInterface } from "@/interfaces/ExamContentInterface/ExamContentInterface";
import { ErrorSubject } from "@/interfaces/SubjectInterface/ErrorExamSubjectInterface";
import { addExamContent, getAllExamContentByIdSubject, importFileExcelContent, updateExamContent } from "@/services/repositories/ExamContentService/ExamContentService";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ExamContent: React.FC = () => {
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
    status: true,
  });

  const openModal = (type: "add" | "edit" | "file") => {
    setModalType(type);
    setModalIsOpen(true);
    setErrors({});
    if (type === "add") {
      setEditMode(false)
    }
    if (!editMode) {
      setFormData({
        id: "",
        title: "",
        status: true,
      });
    }
  };

  const title = ['Mã nội dung thi', 'Tên nội dung thi', 'trạng thái', 'thao tác']

  const openEditModal = (data: ExamContentInterface) => {
    setFormData({
      id: data.id,
      title: data.title,
      status: data.status,
    });
    setEditMode(true);
    setModalType("edit");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditMode(false)
    if (!editMode) {
      setFormData({
        id: "",
        title: "",
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

      addNotification( data.message || "", data.success);
    }
  };

  const validate = (): boolean => {
    const errors: ErrorSubject = {};
    if (!formData.id) errors.id = "Mã không được để trống.";
    if (!formData.title) errors.name = "Tên không được để trống.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createExamContent =  async() => {
    const newContent: ExamContentCreate = {
      exam_subject_id: subject.id,
      id: formData.id,
      title: formData.title,
      status: true,
    };

    const result = await addExamContent(newContent)
    if(result.success) {
      setExamContent([...examContent, newContent]);
    }

    addNotification(result.message, result.success);

    closeModal();
  };

  const handleUpdateSubject = async () => {
    console.log(formData);
    const result = await updateExamContent(formData)
    if(result.success){
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
         content.id === id ? { ...content, Status: !content.status } : content
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

  const formatDataSubject = (data: ExamContentInterface[] | ExamContentInterface) => {
    if (Array.isArray(data)) {
      return data.map((e) => ({
        id: e.id,
        title: e.title,
        status: e.status
      }));
    } else if (data && typeof data === "object") {
      return [
        {
          id: data.id,
          title: data.title,
          status: data.status
        },
      ];
    }

    return [];
  };
   const onload = async () => {
    const result = await getAllExamContentByIdSubject(subject.id);
      if(result.success){
        const data = formatDataSubject(result.data)
        setExamContent(data)
      }
   }
  useEffect(() => {
    if (subject) {
      onload()
    }
  }, [subject]);
  
  useEffect(() => {
    document.documentElement.className = `admin-light`;
  }, [])
  

  return (
    <div className="examContent__container">
      <PageTitle theme="light" showBack={true}>Quản lý nội dung thi</PageTitle>
      <Table
      title={title}
        tableName={`Nội dung thi của môn ${subject?.name || ""}`}
        data={examContent}
        actions_add={{ name: "Thêm mới", onClick: () => openModal("add") }}
        actions_edit={{
          name: "Chỉnh sửa",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                        name="title"
                        className="modal__input"
                        value={formData.title}
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
