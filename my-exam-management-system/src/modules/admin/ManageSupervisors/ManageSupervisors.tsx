import React, { useState } from "react";
import "./ManageSupervisors.scss";
import { Table } from "@components/Table/Table";

import { PageTitle, UploadFile } from "@components/index";
import { useNavigate } from "react-router-dom";
import { Supervisor } from "@/interfaces/SupervisorInterface/SupervisorInterface";
import { ErrorSupervisor } from "@/interfaces/SupervisorInterface/ErrorSupervisorInterface";


const ManageSupervisors = () => {
  
  const [supervisors, setSupervisors] = useState<Supervisor[]>([
    {
      id: "1",
      magt: "PH111",
      name: "Nguyễn Văn A",
      image: "https://picsum.photos/100/100",
      dob: "2004-12-09",
      address: "Hà Nội",
      status: true,
    },
    {
      id: "2",
      magt: "PH112",
      name: "Nguyễn Văn B",
      image: "https://picsum.photos/100/100",
      dob: "2004-12-09",
      address: "Hà Nội",
      status: true,
    },
  ]);
  const [modalType, setModalType] = useState<"add" | "edit" | "file">("add");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorSupervisor>({});
  const [editMode, setEditMode] = useState(false);

  const openModal = (type: "add" | "edit" | "file") => {
    setModalType(type);
    setModalIsOpen(true);
    setErrors({});
    if (type === "add") {
      setEditMode(false);
      setFormData({
        id: "",
        magt: "",
        name: "",
        image: "",
        dob: "",
        address: "",
        
      });
    }
  };
  const [formData, setFormData] = useState({
    id: "",
    magt: "",
    name: "",
    image: "",
    dob: "",
    address: "",
   
  });

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const downloadSample = () => {
    const table = document.querySelector(".subject__table");
    if (!table) {
      console.error("Bảng không được tìm thấy.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    const rows = table.querySelectorAll("tr");

    rows.forEach((row) => {
      const cells = row.querySelectorAll("th");
      const rowContent = Array.from(cells)
        .map((cell) => (cell.textContent || "").replace(/,/g, ""))
        .join(",");
      csvContent += rowContent + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Biểu mẫu Giám thị.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleStatusChange = (id: string) => {
    alert("Status id " + id);
  };
  const validate = (): boolean => {
    console.log("Validating...");
    const errors: ErrorSupervisor = {};

    if (!formData.name) errors.name = "Tên không được để trống.";
    if (!formData.magt) errors.magt = "Mã giám thị không được để trống.";
    if (!formData.image) errors.image = "Ảnh không được để trống.";
    if (!formData.dob) errors.dob = "Ngày sinh không được để trống.";
    if (!formData.address) errors.address = "Địa chỉ không được để trống.";

    setErrors(errors);
    console.log("Errors:", errors);
    return Object.keys(errors).length === 0;
  };

  const [fileName, setFileName] = useState<string>("");

  const handleFileSelect = (fileName: string) => {
    setFileName(fileName);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      alert("Thêm giám thị thành công!");
      setFormData({
        id: "",
        magt: "",
        name: "",
        image: "",
        dob: "",
        address: "",
      });
      closeModal();
    }
  };
    const openEditModal = (data: Supervisor) => {
      setFormData({
        id: data.id,
        magt: data.magt,
        name: data.name,
        image: data.image,
        dob: data.dob,
        address: data.address,
      });
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: URL.createObjectURL(file),
      }));
    }
  };
  const navigate = useNavigate();
  const handleDetailClick = (id: string) => {
    const supervisor = supervisors.find((s) => s.id === id);
    if (supervisor) {
      navigate(
        `/admin/detail-supervisors?${new URLSearchParams(
          supervisor as any
        ).toString()}`
      );
    } else {
      console.error("Candidate not found");
    }
  };

  return (
    <div className="supervisor__container">
      <PageTitle theme="light">Quản lý giám thị</PageTitle>

      <div className="supervisor__information">
        <Table
          tableName="Giám thị"
          data={supervisors}
          actions_add={{ name: "Thêm mới", onClick: () => openModal("add") }}
          action_upload={{
            name: "Upload file",
            onClick: () => openModal("file"),
          }}
          action_dowload={{ name: "Tải mẫu", onClick: downloadSample }}
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
          onClick: (supervisor) => {
            console.log("Edit", supervisor);

            if (supervisor) {
              openEditModal(supervisor);
            }
          },
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
                  ? "Chỉnh sửa môn thi"
                  : modalType === "file"
                  ? "Tải lên file"
                  : "Thêm mới môn thi"}
              </h2>
              {modalType === "file" ? (
                <UploadFile onFileSelect={handleFileSelect} />
              ) : (
                <form className="modal__form" onSubmit={handleSubmit}>
                  <div className="modal__firstline-add">
                    <label className="modal__label">
                      Mã giám thị: <br />
                      <input
                        type="text"
                        name="magt"
                        className="modal__input"
                        value={formData.magt}
                        onChange={handleChange}
                        placeholder="Nhập mã giám thị"
                        readOnly={editMode}
                      />
                      {errors.magt && <p className="error">{errors.magt}</p>}
                    </label>
                    <label className="modal__label">
                      Tên giám thị: <br />
                      <input
                        type="text"
                        name="name"
                        className="modal__input"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập tên giám thị"
                        readOnly={false}
                      />
                      {errors.name && <p className="error">{errors.name}</p>}
                    </label>
                  </div>
                  <div className="modal__firstline-add">
                    <label className="modal__label">
                      Ảnh: <br />
                      {modalType === "add" ? (
                        <>
                          <input
                            type="file"
                            name="image"
                            className="modal__input"
                            onChange={handleFileChange}
                            accept="image/*"
                            disabled={false}
                          />
                          {errors.image && (
                            <p className="error">{errors.image}</p>
                          )}
                        </>
                      ) : (
                        <input
                          type="text"
                          name="image"
                          className="modal__input"
                          value={formData.image}
                          onChange={handleChange}
                          placeholder="Nhập đường dẫn ảnh"
                          readOnly={false}
                        />
                      )}
                    </label>
                    <label className="modal__label">
                      Ngày sinh: <br />
                      <input
                        type="date"
                        name="dob"
                        className="modal__input"
                        value={formData.dob}
                        onChange={handleChange}
                        placeholder="Nhập ngày sinh"
                        readOnly={false}
                      />
                      {errors.dob && <p className="error">{errors.dob}</p>}
                    </label>
                  </div>
                  <div className="modal__firstline-add">
                    <label className="modal__label">
                      Địa chỉ: <br />
                      <input
                        type="text"
                        name="address"
                        className="modal__input"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ"
                        readOnly={false}
                      />
                      {errors.address && (
                        <p className="error">{errors.address}</p>
                      )}
                    </label>
                  </div>
                  <div className="modal__button">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="modal__button-close"
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
    </div>
  );
};

export default ManageSupervisors;
