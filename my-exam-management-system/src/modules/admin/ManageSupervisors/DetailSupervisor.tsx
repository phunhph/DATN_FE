import React, { useEffect, useState } from "react";
import "./DetailSupervisor.scss";
import { Table } from "@components/Table/Table";
import { useLocation } from "react-router-dom";

import { PageTitle, UploadFile } from "@components/index";
import { Supervisor } from "@/interfaces/SupervisorInterface/SupervisorInterface";
import { ErrorSupervisor } from "@/interfaces/SupervisorInterface/ErrorSupervisorInterface";


type Props = {};

const DetailSupervisor = (props: Props) => {
  
  const [formData, setFormData] = useState({
    id: "",
    magt: "",
    name: "",
    image: "",
    dob: "",
    address: "",

  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);

  useEffect(() => {
    const id = queryParams.get("id");
    const magt = queryParams.get("magt");
    const name = queryParams.get("name");
    const image = queryParams.get("image");
    const dob = queryParams.get("dob");
    const address = queryParams.get("address");
    const status = queryParams.get("status");
    console.log({ id, magt, name, image, dob, address, status });

    if (id && magt && name && image && dob && address && status) {
      const supervisor: Supervisor = {
        id,
        magt,
        name,
        image,
        dob,
        address,
       
      };

      setSupervisors([supervisor]);
      console.log("Supervisor:", [supervisor]);
    }
  }, [location.search]);

  const handleStatusChange = (id: string) => {
    alert("Status id " + id);
  };

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

  const [modalType, setModalType] = useState<"add" | "edit" | "file">("add");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorSupervisor>({});
  const [editMode, setEditMode] = useState(false);

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

  return (
    <div className="detailSupervisor__containter">
      <PageTitle theme="light" showBack={true}>Thông tin giám thị</PageTitle>
      <div className="detailSupervisor__content">
        <Table
          tableName={`Giám thị ${
            supervisors.length > 0 ? supervisors[0].name : ""
          }`}
          data={supervisors}
          action_upload={{
            name: "Upload file",
            onClick: () => openModal("file"),
          }}
          action_dowload={{ name: "Tải mẫu", onClick: downloadSample }}
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
                {modalType === "add" ? "Thêm mới giám thị" : "Tải lên file"}
              </h2>
              {modalType === "file" ? (
                <UploadFile onFileSelect={handleFileSelect} />
              ) : (
                <form className="modal__form" onSubmit={handleSubmit}>
                  <div className="modal__firstline-add">
                    <label className="modal__label">
                      Mã môn thi: <br />
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
                      Tên môn thi: <br />
                      <input
                        type="text"
                        name="name"
                        className="modal__input"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập tên môn thi"
                        readOnly={editMode}
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
                            disabled={editMode}
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
                          readOnly={editMode}
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
                        readOnly={editMode}
                      />
                      {errors.dob && <p className="error">{errors.dob}</p>}
                    </label>
                  </div>
                  <div className="modal__thirdline">
                    <label className="modal__label">
                      Địa chỉ: <br />
                      <input
                        type="text"
                        name="address"
                        className="modal__input"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ"
                        readOnly={editMode}
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
                      Thêm
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

export default DetailSupervisor;
