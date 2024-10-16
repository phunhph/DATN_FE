import React, { useState } from "react";
import "./DetailSupervisor.scss";
import { PageTitle, Table } from "@/components";
import { Supervisor } from "@/interfaces/SupervisorInterface/SupervisorInterface";
import { ErrorSupervisor } from "@/interfaces/SupervisorInterface/ErrorSupervisorInterface";

const DetailSupervisor: React.FC = () => {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([
    {
      id: "1",
      magt: "PH111",
      name: "Nguyễn Văn A",
      image: "https://picsum.photos/100/100",
      dob: "2004-12-09",
      address: "Hà Nội",
      status: "active",
    },
    {
      id: "2",
      magt: "PH112",
      name: "Nguyễn Văn B",
      image: "https://picsum.photos/100/100",
      dob: "2004-12-09",
      address: "Hà Nội",
      status: "inactive",
    },
  ]);

  const [modalType, setModalType] = useState<"add" | "edit" | "file">("add");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorSupervisor>({});
  const [editMode, setEditMode] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const [formData, setFormData] = useState({
    id: "",
    magt: "",
    name: "",
    image: "",
    dob: "",
    address: "",
    status: "",
  });

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
        status: "",
      });
    }
    
  };
  const downloadSample = () => {
    const link = document.createElement("a");
    link.href = `public/excel/Supervisor.xlsx`;
    link.download = "Supervisor.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = (id: string) => {
    if (confirm("Are you sure you want to change the status?")) {
      handleUpdateStatus(id);
    }
  };

  return (
    <div className="detailSupervisor__container">
      <PageTitle theme="light">Thông tin giám thị</PageTitle>
      <Table
        tableName="Giám thị"
        data={supervisors}
        action_upload={{
          name: "Upload file",
          onClick: () => openModal("file"),
        }}
        action_dowload={{ name: "Tải mẫu", onClick: downloadSample }}
        action_status={handleStatusChange}
      />
    </div>
  );
};

export default DetailSupervisor;
