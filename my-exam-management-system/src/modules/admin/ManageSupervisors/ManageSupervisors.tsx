import { PageTitle, Table } from "@/components";
import "./ManageSupervisors.scss";
import React, { useState } from "react";
import { Supervisor } from "@/interfaces/SupervisorInterface/SupervisorInterface";
import { ErrorSupervisor } from "@/interfaces/SupervisorInterface/ErrorSupervisorInterface";
import { useNavigate } from "react-router-dom";

const ManageSupervisors: React.FC = () => {
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
  const [formData, setFormData] = useState({
    id: "",
    magt: "",
    name: "",
    image: "",
    dob: "",
    address: "",
    status: "",
  });

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const downloadSample = () => {
    const link = document.createElement("a");
    link.href = `public/excel/Supervisor.xlsx`;
    link.download = "Supervisor.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      console.error("Supervisor not found");
    }
  };

  const handleStatusChange = (id: string) => {
    if (confirm("Are you sure you want to change the status?")) {
      handleUpdateStatus(id);
    }
  };

  return (
    <div className="supervisor__container">
      <PageTitle theme="light">Quản lý giám thị</PageTitle>
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
        action_status={handleStatusChange}
      />
    </div>
  );
};

export default ManageSupervisors;
