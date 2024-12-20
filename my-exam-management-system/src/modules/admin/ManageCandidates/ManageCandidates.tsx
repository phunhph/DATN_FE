import {
  Notification,
  PageTitle,
  UploadFile,
  Table,
  Button,
} from "@/components";
import { Exam } from "@/interfaces/ExamInterface/ExamInterface";
import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import "./ManageCandidates.scss";
import {
  Candidate,
  CreateCandidate,
} from "@/interfaces/CandidateInterface/CandidateInterface";
import { ErrorCandidate } from "@/interfaces/CandidateInterface/ErrorCandidateInterface";
import { useNavigate } from "react-router-dom";
import {
  getAllWithStatusTrue,
  CandidateInExamRoom,
  addCandidate,
  exportExcelCandidate,
  importCandidates,
} from "@/services/repositories/CandidatesService/CandidatesService";
import { getExamRoomsInExams } from "@/services/repositories/ExamRoomService/ExamRoomService";
import { applyTheme } from "@/SCSS/applyTheme";
import { useAdminAuth } from "@/hooks";

const ManageCandidates: React.FC = () => {
  useAdminAuth();
  applyTheme();

  const title = [
    "Mã sinh viên",
    "Tên",
    "Ảnh",
    "Ngày sinh",
    "Nơi sinh",
    "Hành động",
  ];

  const [exams, setExams] = useState<Exam[]>([]);

  const handleChangeOptionExams = (id: string, exam_room_id?: string) => {
    const callAPI = async () => {
      const result = await getExamRoomsInExams(id);
      if (result.success) {
        const roomsData = result.data.data;
        setRooms(roomsData);
        if (exam_room_id) {
          setSelectedRoomId(exam_room_id);
          handleChangeRoom(exam_room_id);
        } else {
          if (roomsData.length > 0) {
            setSelectedRoomId(roomsData[0].id);
            handleChangeRoom(roomsData[0].id);
          } else {
            handleChangeRoom("");
          }
        }
      }
    };
    callAPI();
  };

  const [rooms, setRooms] = useState<any>([]);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const handleChangeRoom = (id: string) => {
    if (id != "") {
      const callAPI = async () => {
        const result = await CandidateInExamRoom(id);
        if (result.success) {
          if (result.data.data.length > 0) {
            setCandidates(result.data.data);
          } else {
            setCandidates([]);
          }
        }
      };
      callAPI();
    } else {
      setRooms([]);
      setCandidates([]);
    }
  };

  const [formData, setFormData] = useState<CreateCandidate>({
    idcode: "",
    name: "",
    image: "",
    dob: "",
    address: "",
    email: "",
    status: "",
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
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const examOptions = exams.map((exam) => ({
    label: exam.name,
    value: exam.id,
  }));
  const roomOptions = rooms.map((room: any) => ({
    label: room.name,
    value: room.id,
  }));
  useEffect(() => {
    const initializeData = async () => {
      const result = await getAllWithStatusTrue();
      if (result.success && result.data) {
        setExams(result.data.data);

        const firstExamOption = result.data.data[0];
        if (firstExamOption) {
          setSelectedExamId(firstExamOption.id);
          handleChangeOptionExams(firstExamOption.id);
        }
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      handleChangeOptionExams(selectedExamId);
    }
  }, [selectedExamId]);

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
        idcode: "",
        name: "",
        image: "",
        dob: "",
        address: "",
        email: "",
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

  const navigate = useNavigate();

  const handleDetailClick = (id: string) => {
    const candidate = candidates.find((c) => c.idcode === id);
    if (candidate) {
      navigate(`/admin/detail-candidates?idcode=${id}`);
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
    if (!formData.idcode) errors.sbd = "Số báo danh không được để trống.";
    if (!formData.dob) errors.dob = "Ngày sinh không được để trống.";
    if (!formData.address) errors.address = "Địa chỉ không được để trống.";
    if (!formData.email) errors.email = "Địa chỉ email không được để trống.";

    setErrors(errors);
    console.log("Errors:", errors);
    return Object.keys(errors).length === 0;
  };
  function generateRandomCode() {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const randomLetters = Array.from({ length: 6 }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join("");

    const randomNumber = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");

    return randomLetters + randomNumber;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      const callAPI = async () => {
        const newFormData = new FormData();

        newFormData.append("idcode", formData.idcode);
        newFormData.append("name", formData.name);
        newFormData.append("image", formData.image);
        newFormData.append("dob", formData.dob);
        newFormData.append("address", formData.address);
        newFormData.append("email", formData.email);
        newFormData.append("password", generateRandomCode());
        newFormData.append("status", "true");

        const result = await addCandidate(newFormData);

        if (result.success) {
          const newCandidate = result.data.candidate;

          setSelectedExamId(newCandidate.exam_id);
          handleChangeOptionExams(
            newCandidate.exam_id,
            newCandidate.exam_room_id
          );
          addNotification("Thêm mới thí sinh thành công", true);
          setFormData({
            idcode: "",
            name: "",
            image: "",
            dob: "",
            address: "",
            email: "",
            status: "",
          });
          // setCandidates((prevCandidates) => [...prevCandidates, newCandidate]);
        } else {
          addNotification("Thêm mới thí sinh thất bại", false);
        }
      };
      callAPI();
      console.log("Form Data:", formData);

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
        image: file,
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

  const handleUpdateStatus = (id: string | number) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) =>
        candidate.id === id
          ? { ...candidate, Status: !candidate.status }
          : candidate
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
  const handleExportAll = async () => {
    try {
      const response = await exportExcelCandidate("", "");
      if (response.success) {
        addNotification("Xuất file Excel thành công", true);
      } else {
        addNotification(response.message || "Xuất file thất bại", false);
      }
    } catch (error) {
      addNotification("Đã xảy ra lỗi khi xuất file", false);
    }
  };

  const handleExportByExam = async () => {
    if (!selectedExamId) {
      addNotification("Vui lòng chọn kỳ thi", false);
      return;
    }
    try {
      const response = await exportExcelCandidate("exam", selectedExamId);
      if (response.success) {
        addNotification("Xuất file Excel thành công", true);
      } else {
        addNotification(response.message || "Xuất file thất bại", false);
      }
    } catch (error) {
      addNotification("Đã xảy ra lỗi khi xuất file", false);
    }
  };

  const handleExportByRoom = async () => {
    if (!selectedRoomId) {
      addNotification("Vui lòng chọn phòng thi", false);
      return;
    }
    try {
      const response = await exportExcelCandidate(
        "exam_room",
        selectedRoomId.toString()
      );
      if (response.success) {
        addNotification("Xuất file Excel thành công", true);
      } else {
        addNotification(response.message || "Xuất file thất bại", false);
      }
    } catch (error) {
      addNotification("Đã xảy ra lỗi khi xuất file", false);
    }
  };

  const handleFileDrop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      addNotification("Vui lòng chọn file", false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await importCandidates(file);
      if (response.success) {
        addNotification("Import thành công", true);
        if (selectedRoomId) {
          handleChangeRoom(selectedRoomId);
        }
        fileInput.value = "";
      } else {
        addNotification(response.message || "Import thất bại", false);
      }
    } catch (error: any) {
      addNotification(error.response?.data?.message || "Lỗi khi import", false);
    }
  };

  return (
    <div className="candidate__admin-container">
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
              if (selectedOption?.value) {
                handleChangeOptionExams(selectedOption?.value);
              }
            }}
          />
        </div>

        <h2>Phòng thi</h2>
        <AsyncSelect
          cacheOptions
          loadOptions={loadRoomOptions}
          defaultOptions={roomOptions}
          value={
            roomOptions.length > 0
              ? roomOptions.find(
                (option: any) => option.value === selectedRoomId
              )
              : ""
          }
          onChange={(selectedRoomOption) => {
            setSelectedRoomId(selectedRoomOption?.value || "");
            handleChangeRoom(selectedRoomOption?.value);
            console.log("selectedRoomOption: " + selectedRoomOption?.value);
          }}
        />
        <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
          <Button className="export-btn" onClick={handleExportAll}>
            Xuất tất cả
          </Button>
          <Button className="export-btn" onClick={handleExportByExam}>
            Xuất theo kỳ thi
          </Button>
          <Button className="export-btn" onClick={handleExportByRoom}>
            Xuất theo phòng
          </Button>
        </div>
        {/* <form onSubmit={handleFileDrop}>
          <label htmlFor="upload-file-btn"className="upload-file-btn">Tải file lên </label>
          <input id="upload-file-btn" className="upload-file-btn" type="file" accept=".xlsx,.xls"/>
          <Button type="submit" className="export-btn">Gửi</Button>
        </form> */}
      </div>

      <Table
        title={title}
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
            <div
              className="modal__content"
              style={{ width: "700px", height: "auto" }}
            >
              <button className="modal__close" onClick={closeModal}>
                X
              </button>
              <h2 className="modal__title">
                {modalType === "add" ? "Thêm mới thí sinh" : "Tải lên file"}
              </h2>
              {modalType === "file" ? (
                <div className="modal__file-content">
                  <p>Hãy chọn file từ máy tính của bạn.</p>
                  <div className="file-upload-container">
                    <form
                      className="file-upload-form"
                      onSubmit={handleFileDrop}
                    >
                      <div className="file-input-container">
                        <input
                          id="upload-file-btn"
                          className="upload-file-btn"
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            setFileName(file ? file.name : "");
                          }}
                        />
                        <label
                          className="label_upload"
                          htmlFor="upload-file-btn"
                        >
                          <span className="left_content">
                            {fileName || "Chưa chọn file"}
                          </span>
                          <div className="file-select-button right_content">
                            Chọn file
                          </div>
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="submit-button"
                        disabled={!fileName} // Disable nút khi chưa chọn file
                      >
                        Gửi
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <form
                  className="modal__form"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  <div className="modal__firstline-add">
                    <label className="modal__label">
                      Mã thí sinh: <br />
                      <input
                        type="text"
                        name="idcode"
                        className="modal__input"
                        value={formData.idcode}
                        onChange={handleChange}
                        placeholder="Nhập số báo danh"
                        readOnly={editMode}
                      />
                      {errors.idcode && (
                        <p className="error">{errors.idcode}</p>
                      )}
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
                      Email: <br />
                      <input
                        type="text"
                        name="email"
                        className="modal__input"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ"
                        readOnly={editMode}
                      />
                      {errors.email && <p className="error">{errors.email}</p>}
                    </label>
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
                    <Button type="submit" style={{color:"white", marginRight:"1rem"}}>Thêm</Button>
                    <Button type="button" onClick={closeModal} style={{color:"white"}}>
                      Đóng
                    </Button>
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
