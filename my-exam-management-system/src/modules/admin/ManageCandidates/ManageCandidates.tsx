import { Notification, PageTitle, UploadFile,Table } from "@/components";
import { Exam } from "@/interfaces/ExamInterface/ExamInterface";
import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import "./ManageCandidates.scss";
import { Candidate } from "@/interfaces/CandidateInterface/CandidateInterface";
import { ErrorCandidate } from "@/interfaces/CandidateInterface/ErrorCandidateInterface";
import { useNavigate } from "react-router-dom";

const ManageCandidates: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: 1,
      Name: "Kỳ thi Bảy viên ngọc rồng",
      TimeStart: "2024-06-01",
      TimeEnd: "2024-06-03",
      Status: true,
    },
    {
      id: 2,
      Name: "Kỳ thi Thuỷ thủ mặt trăng",
      TimeStart: "2024-06-01",
      TimeEnd: "2024-06-03",
      Status: true,
    },
  ]);
  const [rooms, setRooms] = useState<any>([
    {
      id: 1,
      Name: "Phòng điều hoà",
    },
    {
      id: 2,
      Name: "Phòng quạt trần",
    },
  ]);

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "1",
      sbd: "PH111",
      name: "Nguyễn Văn A",
      image: "https://picsum.photos/100/100",
      dob: "2004-12-09",
      address: "Hà Nội",
      status: true,
    },
    {
      id: "2",
      sbd: "PH112",
      name: "Nguyễn Văn B",
      image: "https://picsum.photos/100/100",
      dob: "2004-12-09",
      address: "Hà Nội",
      status: true,
    },
  ]);
  const [formData, setFormData] = useState<Candidate>({
    id: "",
    sbd: "",
    name: "",
    image: "",
    dob: "",
    address: "",
  });

  const loadSemesterOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    setTimeout(() => {
      callback(
        examOptions.filter((i) =>
          i.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }, 1000);
  };
  const loadRoomOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    setTimeout(() => {
      callback(
        roomOptions.filter((i) =>
          i.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }, 1000);
  };

  const [selectedExamId, setSelectedExamId] = useState<string>("");

  const examOptions = exams.map((exam) => ({
    label: exam.Name,
    value: exam.id,
  }));
  const roomOptions = rooms.map((room: any) => ({
    label: room.Name,
    value: room.id,
  }));
  const firstOption = examOptions[0];
  const firstRoomOption = roomOptions[0];

  useEffect(() => {
    if (firstOption) {
      setSelectedExamId(firstOption.value);
    }
    if (firstRoomOption) {
      setSelectedExamId(firstRoomOption.value);
    }
  }, [firstOption, firstRoomOption]);

  const [modalType, setModalType] = useState<"add" | "edit" | "file">("add");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorCandidate>({});
  const [editMode, setEditMode] = useState(false);

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

  const navigate = useNavigate();

  const handleDetailClick = (id: string) => {
    const candidate = candidates.find((c) => c.id === id);
    if (candidate) {
      navigate(
        `/admin/detail-candidates?${new URLSearchParams(
          candidate as any
        ).toString()}`
      );
    } else {
      console.error("Candidate not found");
    }
  };

  const [fileName, setFileName] = useState<string>("");

  const handleFileSelect = (fileName: string) => {
    setFileName(fileName);
  };

  const validate = (): boolean => {
    console.log("Validating...");
    const errors: ErrorCandidate = {};

    if (!formData.name) errors.name = "Tên không được để trống.";
    if (!formData.sbd) errors.sbd = "Số báo danh không được để trống.";
    if (!formData.image) errors.image = "Ảnh không được để trống.";
    if (!formData.dob) errors.dob = "Ngày sinh không được để trống.";
    if (!formData.address) errors.address = "Địa chỉ không được để trống.";

    setErrors(errors);
    console.log("Errors:", errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      alert("Thêm thí sinh thành công!");
      setFormData({
        id: "",
        sbd: "",
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
      const imageUrl = URL.createObjectURL(file);
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: imageUrl,
      }));
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

    const handleUpdateStatus = (id: string|number) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) =>
        candidate.id === id ? { ...candidate, Status: !candidate.status } : candidate
      )
    );
    addNotification(`Trạng thái của môn thi đã được thay đổi.`, true);
  };

  const handleStatusChange = (id: string | number) => {
    console.log(`Changing status for candidate with ID: ${id}`);
    if (confirm("Are you sure you want to change the status?")) {
      handleUpdateStatus(id);
    }
  };

  return (
    <div className="candidate__container">
      <PageTitle theme="light">Quản lý thí sinh</PageTitle>
      <div className="candidate__select">
        <div className="candidate__select-semester">
         
          <h2>Kỳ thi</h2>
          <AsyncSelect
            cacheOptions
            loadOptions={loadSemesterOptions}
            defaultOptions={examOptions}
            value={examOptions.find(
              (option) => option.value === selectedExamId
            )}
            onChange={(selectedOption) => {
              setSelectedExamId(selectedOption?.value || "");
            }}
          />
        </div>

        <h2>Phòng thi</h2>
        <AsyncSelect
          cacheOptions
          loadOptions={loadRoomOptions}
          defaultOptions={roomOptions}
          value={roomOptions.find((option) => option.value === selectedExamId)}
          onChange={(selectedRoomOption) => {
            setSelectedExamId(selectedRoomOption?.value || "");
          }}
        />
      </div>
      <Table
        tableName="Thí sinh"
        data={candidates}
        actions_add={{ name: "Thêm mới", onClick: () => openModal("add") }}
        action_upload={{
          name: "Upload file",
          onClick: () => openModal("file"),
        }}
        action_dowload={{ name: "Tải mẫu", onClick: downloadSample }}
        actions_detail={{
          name: "Chi tiết",
          onClick: (candidate) => {
            if (candidate) {
              handleDetailClick(candidate);
            }
          },
        }}
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
                {modalType === "add" ? "Thêm mới thí sinh" : "Tải lên file"}
              </h2>
              {modalType === "file" ? (
                <UploadFile onFileSelect={handleFileSelect} />
              ) : (
                <form className="modal__form" onSubmit={handleSubmit}>
                  <div className="modal__firstline-add">
                    <label className="modal__label">
                      Mã thí sinh: <br />
                      <input
                        type="text"
                        name="sbd"
                        className="modal__input"
                        value={formData.sbd}
                        onChange={handleChange}
                        placeholder="Nhập số báo danh"
                        readOnly={editMode}
                      />
                      {errors.sbd && <p className="error">{errors.sbd}</p>}
                    </label>
                    <label className="modal__label">
                      Tên thí sinh: <br />
                      <input
                        type="text"
                        name="name"
                        className="modal__input"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập tên thí sinh"
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
                          type="file"
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
      <Notification
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
    </div>
  );
};

export default ManageCandidates;
