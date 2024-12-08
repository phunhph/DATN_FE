import { Notification, PageTitle, Table } from "@/components";
import { Candidate } from "@/interfaces/CandidateInterface/CandidateInterface";
import { ErrorCandidate } from "@/interfaces/CandidateInterface/ErrorCandidateInterface";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./DetailCandidates.scss";
import {
  DetailCandidate,
  toggleActiveStatus,
} from "@/services/repositories/CandidatesService/CandidatesService";
import applyTheme from "@/SCSS/applyTheme";

const DetailCandidates: React.FC = () => {
  applyTheme()

  const title = ["Môn thi", "Trạng thái"];
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [dataTable, setDataTable] = useState([]);
  useEffect(() => {
    const idcode = queryParams.get("idcode");

    const callAPI = async (id: string) => {
      try {
        const result = await DetailCandidate(id);
        if (result.success) {
          const data = result.data.data;
          setCandidates(data.candidate);

          // Format lại data cho table
          const datakey = data.exam_subject.map((subject) => ({
            subject_name: subject.name,
            status: data.actives.some(
              (active) => active.exam_subject_id === subject.id && active.status
            )
              ? "Đang hoạt động"
              : "Không hoạt động",
          }));

          setDataTable(datakey);
        } else {
          console.error("Failed to fetch data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (idcode) {
      callAPI(idcode);
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

  const handleStatusChange = async (data: any) => {
    try {
      const result = await toggleActiveStatus(
        data._metadata.exam_subject_id,
        data._metadata.idcode
      );

      if (result.success) {
        addNotification(result.message, true);
        // Tải lại data
        const idcode = queryParams.get("idcode");
        if (idcode) {
          callAPI(idcode);
        }
      } else {
        addNotification(result.message, false);
      }
    } catch (error) {
      console.error("Error:", error);
      addNotification("Có lỗi xảy ra khi cập nhật trạng thái", false);
    }
  };
  const CandidateInfo: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
    return (
      <div className="candidate-info">
        <div className="candidate-info__image">
          <img src={candidate.image?.slice(27)} alt={candidate.name} />
        </div>
        <div className="candidate-info__details">
          <h2>{candidate.name}</h2>
          <p>
            <strong>Mã sinh viên:</strong> {candidate.idcode}
          </p>
          <p>
            <strong>Ngày sinh:</strong> {candidate.dob}
          </p>
          <p>
            <strong>Nơi sinh:</strong> {candidate.address}
          </p>
          <p>
            <strong>Email:</strong> {candidate.email}
          </p>
          <p>
            <strong>Phòng thi:</strong>
            {candidate.exam_room ? candidate.exam_room.name : ""}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {candidate.status ? "Đang hoạt động" : "Ngừng hoạt động"}
          </p>
        </div>
      </div>
    );
  };
  return (
    <div className="detailCandidate__container">
      <PageTitle theme="light" showBack={true}>
        Thông tin thí sinh
      </PageTitle>
      {candidates && <CandidateInfo candidate={candidates} />}
      <Table
        title={title}
        tableName={`Thí sinh ${
          candidates.length > 0 ? candidates[0].name : ""
        }`}
        data={dataTable}
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
