import { Notification, PageTitle, Table } from "@/components";
import { Candidate } from "@/interfaces/CandidateInterface/CandidateInterface";
import { ErrorCandidate } from "@/interfaces/CandidateInterface/ErrorCandidateInterface";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const DetailCandidates: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  useEffect(() => {
    const id = queryParams.get("id");
    const sbd = queryParams.get("sbd");
    const name = queryParams.get("name");
    const image = queryParams.get("image");
    const dob = queryParams.get("dob");
    const address = queryParams.get("address");
    const status = queryParams.get("status");
    console.log({ id, sbd, name, image, dob, address, status });

    if (id && sbd && name && image && dob && address && status) {
      const candidate: Candidate = {
        id,
        sbd,
        name,
        image,
        dob,
        address,
      };

      setCandidates([candidate]);
      console.log("Candidates:", [candidate]);
    }
  }, [location.search]);

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
    status: true,
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
        status: true,
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

  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);
  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleUpdateStatus = (id: string) => {
    setCandidates((prevContents) =>
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
  return (
    <div className="detailCandidate__container">
      <PageTitle theme="light" showBack={true}>Thông tin thí sinh</PageTitle>
      <Table
        tableName={`Thí sinh ${
          candidates.length > 0 ? candidates[0].name : ""
        }`}
        data={candidates}
        action_upload={{
          name: "Upload file",
          onClick: () => openModal("file"),
        }}
        action_dowload={{ name: "Tải mẫu", onClick: downloadSample }}
        action_status={handleStatusChange}
      />
      <Notification
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
    </div>
  );
};

export default DetailCandidates;
