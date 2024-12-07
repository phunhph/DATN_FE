import React, { useEffect, useState } from "react";
import "./ManageSupervisors.scss";
import { Table } from "@components/Table/Table";

import { Notification, PageTitle, UploadFile } from "@components/index";
import { useNavigate } from "react-router-dom";
import { Supervisor } from "@/interfaces/SupervisorInterface/SupervisorInterface";
import { ErrorSupervisor } from "@/interfaces/SupervisorInterface/ErrorSupervisorInterface";
import {
  addSupervisor,
  getAllSupervisors,
} from "@/services/repositories/SupervisorsService/SupervisorsService";
import applyTheme from "@/SCSS/applyTheme";

const ManageSupervisors = () => {
  applyTheme()

  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);

  const [modalType, setModalType] = useState<"add" | "edit" | "file">("add");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    idcode: "",
    name: "",
    profile: "",
    email: "",
  });

  const [errors, setErrors] = useState<ErrorSupervisor>({});
  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);

  const navigate = useNavigate();

  const getSupervisors = async () => {
    const data = await getAllSupervisors();
    console.log("Dữ liệu trả về từ API:", data);

    if (data.success) {
      const supervisorList = data.data.data;
      console.log("Danh sách giám thị:", supervisorList);

      if (Array.isArray(supervisorList)) {
        setSupervisors(supervisorList);
      } else {
        console.log("Dữ liệu không phải là mảng.");
        setSupervisors([]);
      }
    } else {
      addNotification(data.message ?? "Đã có lỗi xảy ra", data.success);
    }
  };

  const onLoad = () => {
    getSupervisors();
  };

  useEffect(() => {
    onLoad();
  }, []);

  const openModal = (type: "add" | "edit" | "file") => {
    setModalType(type);
    setModalIsOpen(true);
    setErrors({});
    if (type === "add") {
      setEditMode(false);
      resetForm();
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const resetForm = () => {
    setFormData({
      idcode: "",
      name: "",
      profile: "",
      email: "",
    });
  };

  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const validate = (): boolean => {
    const errors: ErrorSupervisor = {};
    if (!formData.name) errors.name = "Tên không được để trống.";
    if (!formData.idcode) errors.idcode = "Mã giám thị không được để trống.";
    if (!formData.profile) errors.profile = "Ảnh không được để trống.";
    if (!formData.email) errors.email = "Email không được để trống.";

    setErrors(errors);
    console.log("Errors:", errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      const callAPI = async () => {

        const result = await addSupervisor(formData);
        console.log("Kết quả trả về:", formData);

        if (result.success) {
          const newSupervisor = result.data.supervisors;
          setSupervisors((prevSupervisors) => [
            ...prevSupervisors,
            newSupervisor,
          ]);
         addNotification("Thêm giám thị thành công!", true);
         resetForm();

       
         getSupervisors();
          setFormData({
            idcode: "",
            name: "",
            profile: "",
            email: "",
          });
        } else {
          console.log("Lỗi kết quả: ", result.error);
          addNotification(result.message ?? "Đã có lỗi xảy ra", false);
        }
      };
      callAPI();
      closeModal();
    }
  };

  const openEditModal = (data: Supervisor) => {
    setFormData(data);
    setEditMode(true);
    setModalType("edit");
    setModalIsOpen(true);
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
    setSupervisors((prevSupervisors) =>
      prevSupervisors.map((supervisor) =>
        supervisor.idcode === id
          ? { ...supervisor, status: !supervisor.status }
          : supervisor
      )
    );
    addNotification(`Trạng thái của môn thi đã được thay đổi.`, true);
  };

  const handleStatusChange = (id: string) => {
    if (confirm("Are you sure you want to change the status?")) {
      handleUpdateStatus(id);
    }
  };

  const handleDetailClick = (id: string) => {
    const supervisor = supervisors.find((s) => s.idcode === id);
    if (supervisor) {
      navigate(`/admin/detail-supervisors/${id}`);
    }
  };

  const title = ["Mã giảng viên", "Tên", "Ảnh", "Trạng thái", "Thao tác"];

 const formattedSupervisors = Array.isArray(supervisors)
   ? supervisors
       .filter((supervisor) => supervisor.idcode && supervisor.name) 
       .map((supervisor) => ({
         idcode: supervisor.idcode,
         name: supervisor.name,
         profile: supervisor.profile,
         status: supervisor.status,
       }))
   : [];


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        profile: file,
      }));
    }
  };
  

  

  return (
    <div className="supervisor__container">
      <PageTitle theme="light">Quản lý Giám thị</PageTitle>

      <div className="supervisor__information">
        <Table
          title={title}
          tableName="Giám thị"
          data={formattedSupervisors}
          actions_add={{ name: "Thêm mới", onClick: () => openModal("add") }}
          action_upload={{
            name: "Upload file",
            onClick: () => openModal("file"),
          }}
          action_dowload={{ name: "Tải mẫu", onClick: () => {} }}
          actions_detail={{
            name: "Chi tiết",
            onClick: (supervisor) => {
              if (supervisor) {
                handleDetailClick(supervisor);
              }
            },
          }}
          actions_edit={{
            name: "Chỉnh sửa",
            onClick: openEditModal,
          }}
          action_status={handleStatusChange}
        />
      </div>

      {modalIsOpen && (
        <div className="modal">
          <div className="modal__overlay">
            <div className="modal__content">
              <button className="modal__close" onClick={closeModal}>
                X
              </button>
              <h2 className="modal__title">
                {modalType === "edit"
                  ? "Chỉnh sửa giám thị"
                  : modalType === "file"
                  ? "Tải lên file"
                  : "Thêm mới giám thị"}
              </h2>
              {modalType === "file" ? (
                <UploadFile onFileSelect={() => {}} />
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="modal__firstline-add">
                    <label className="modal__label">
                      Mã Giám thị:
                      <input
                        type="text"
                        name="idcode"
                        className="modal__input"
                        value={formData.idcode}
                        onChange={handleChange}
                        placeholder="Nhập mã giám thị"
                        readOnly={editMode}
                      />
                      {errors.idcode && (
                        <p className="error">{errors.idcode}</p>
                      )}
                    </label>
                    <label className="modal__label">
                      Tên Giám thị:
                      <input
                        type="text"
                        name="name"
                        className="modal__input"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập tên giám thị"
                      />
                      {errors.name && <p className="error">{errors.name}</p>}
                    </label>
                  </div>
                  <div className="modal__firstline-add">
                    <label className="modal__label">
                      Email:
                      <input
                        type="text"
                        name="email"
                        className="modal__input"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập email"
                      />
                      {errors.email && <p className="error">{errors.email}</p>}
                    </label>
                  </div>
                  <div className="modal__firstline-add">
                    <label className="modal__label">
                      Hình ảnh:
                      <input
                       
                        type="file"
                        className="modal__input"
                        onChange={handleFileChange}
                      />
                      {errors.profile && (
                        <p className="error">{errors.profile}</p>
                      )}
                    </label>
                  </div>

                  <div className="modal__button">
                    <button
                      name="status"
                      type="button"
                      onClick={closeModal}
                      className="modal__button-close"
                      value={true}
                    >
                      Đóng
                    </button>
                    <button type="submit" className="modal__button-add">
                      {editMode ? "Cập nhật" : "Thêm mới"}
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

export default ManageSupervisors;
