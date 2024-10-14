import { PageTitle, Table } from "@/components";
import { Candidate } from "@/interfaces/CandidateInterface/CandidateInterface";
import { ErrorCandidate } from "@/interfaces/CandidateInterface/ErrorCandidateInterface";
import React, { useState } from "react";

const DetailCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "1",
      sbd: "PH111",
      name: "Nguyễn Văn A",
      image: "https://picsum.photos/100/100",
      dob: "2004-12-09",
      address: "Hà Nội",
      status: "active",
    },
    {
      id: "2",
      sbd: "PH112",
      name: "Nguyễn Văn B",
      image: "https://picsum.photos/100/100",
      dob: "2004-12-09",
      address: "Hà Nội",
      status: "inactive",
    },
  ]);

  const [modalType, setModalType] = useState<"add" | "edit" | "file">("add");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorCandidate>({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    sbd: "",
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
        sbd: "",
        name: "",
        image: "",
        dob: "",
        address: "",
        status: "",
      });
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const downloadSample = () => {
    const link = document.createElement("a");
    link.href = `public/excel/Candidate.xlsx`;
    link.download = "Candidate.xlsx";
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
    <div className="detailCandidate__container">
      <PageTitle theme="light">Thông tin thí sinh</PageTitle>
      <Table
        tableName="Thí sinh"
        data={candidates}
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

export default DetailCandidates;
