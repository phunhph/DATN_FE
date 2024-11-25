import {
  editExamRoom,
  getExamRoomDetail,
} from "@/services/repositories/ExamRoomService/ExamRoomService";
import { Notification } from "@components/index";
import { Table } from "@components/Table/Table";
import { useAdminAuth } from "@hooks/AutherHooks";
import { ErrorExamRoom } from "@interfaces/ExamRoomInterfaces/ErrorExamRoomInterfaces";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ManageExamRoomDetail.scss";

interface RoomDetailData {
  exam_id: string;
  name: string;
  candidates_count: number;
  exam_session_name: string;
  exam_subject_name: string;
  exam_session_time_start: string;
  exam_session_time_end: string;
}

const ManageExamRoomDetail = () => {
  useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.room;

  const [roomDetail, setRoomDetail] = useState<RoomDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorExamRoom>({});
  const [formData, setFormData] = useState<RoomDetailData>({
    exam_id: "",
    name: "",
    candidates_count: 0,
    exam_session_name: "",
    exam_subject_name: "",
    exam_session_time_start: "",
    exam_session_time_end: "",
  });

  const title = [
    "ID",
    "Phòng thi",
    "Ca thi",
    "Môn thi",
    "Thời gian bắt đầu",
    "Thời gian kết thúc",
    "Thao tác",
  ];

  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const loadExamRoomDetail = async () => {
    if (!room?.id) {
      setError("Không tìm thấy thông tin phòng thi");
      setLoading(false);
      return;
    }

    try {
      const result = await getExamRoomDetail(room.id);

      if (result.success && result.data) {
        const { examRoom, exam_sessions, exam_subjects } = result.data;

        const formattedData = {
          exam_id: examRoom.id,
          name: examRoom.name,
          exam_session_name: exam_sessions[0]?.name || "Chưa có ca thi",
          exam_subject_name: exam_subjects[0]?.name || "Chưa có môn thi",
          exam_session_time_start:
            exam_sessions[0]?.time_start || "Chưa có thời gian",
          exam_session_time_end:
            exam_sessions[0]?.time_end || "Chưa có thời gian",
        };

        setRoomDetail(formattedData);
        setFormData(formattedData);
        setError("");
      } else {
        setError(result.message || "Lỗi khi lấy thông tin phòng thi");
      }
    } catch (err) {
      setError("Lỗi khi tải thông tin phòng thi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!room) {
      navigate("/admin/manage-exam-rooms");
      return;
    }
    loadExamRoomDetail();
  }, [room, navigate]);

  const validate = (): boolean => {
    const newErrors: ErrorExamRoom = {};

    if (!formData.exam_session_name) {
      newErrors.exam_session_name = "Ca thi không được để trống";
    }
    if (!formData.exam_subject_name) {
      newErrors.exam_subject_name = "Tên môn thi không được để trống";
    }
    if (!formData.exam_session_time_start) {
      newErrors.exam_session_time_start =
        "Thời gian bắt đầu không được để trống";
    }
    if (!formData.exam_session_time_end) {
      newErrors.exam_session_time_end =
        "Thời gian kết thúc không được để trống";
    }

    // Validate datetime format
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (
      formData.exam_session_time_start &&
      !dateRegex.test(formData.exam_session_time_start)
    ) {
      newErrors.exam_session_time_start =
        "Định dạng thời gian không hợp lệ (YYYY-MM-DD HH:mm:ss)";
    }
    if (
      formData.exam_session_time_end &&
      !dateRegex.test(formData.exam_session_time_end)
    ) {
      newErrors.exam_session_time_end =
        "Định dạng thời gian không hợp lệ (YYYY-MM-DD HH:mm:ss)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    console.log("log fomdata:", formData);

    try {
      const result = await editExamRoom(formData.exam_id, formData);

      if (result.success) {
        setRoomDetail(formData);
        addNotification("Cập nhật thành công!", true);
        closeModal();
        await loadExamRoomDetail(); // Reload data after successful update
      } else {
        addNotification(result.message || "Cập nhật không thành công!", false);
      }
    } catch (error) {
      addNotification("Lỗi khi cập nhật phòng thi", false);
      console.error("Error updating exam room:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEditModal = (data: RoomDetailData) => {
    if (!data.exam_id) {
      addNotification("Không tìm thấy thông tin phòng thi", false);
      return;
    }
    setFormData(data);
    setEditMode(true);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditMode(false);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="room__container">Đang tải thông tin phòng thi...</div>
    );
  }

  if (error) {
    return (
      <div className="room__container">
        <div className="error-message">{error}</div>
        <Notification
          notifications={notifications}
          clearNotifications={clearNotifications}
        />
      </div>
    );
  }

  return (
    <div className="room__container">
      <div className="room__title">
        <h1>
          Chi tiết phòng thi {roomDetail?.name ? `(${roomDetail.name})` : ""}
        </h1>
      </div>

      {roomDetail && (
        <Table
          title={title}
          tableName="Chi tiết phòng thi"
          data={[roomDetail]}
          actions_edit={{
            name: "Chỉnh sửa",
            onClick: (exam) => {
              if (exam) {
                openEditModal(exam as RoomDetailData);
              }
            },
          }}
        />
      )}

      {modalIsOpen && (
        <div className="modal">
          <div className="modal__overlay">
            <div className="modal__content">
              <button className="modal__close" onClick={closeModal}>
                ×
              </button>
              <h2 className="modal__title">Chỉnh sửa thông tin phòng thi</h2>

              <form className="modal__form" onSubmit={handleSubmit}>
                <div className="modal__firstline">
                  <label className="modal__label">
                    Ca thi:
                    <input
                      type="text"
                      name="exam_session_name"
                      className="modal__input"
                      value={formData.exam_session_name}
                      onChange={handleChange}
                      placeholder="Nhập ca thi"
                    />
                    {errors.exam_session_name && (
                      <p className="error">{errors.exam_session_name}</p>
                    )}
                  </label>

                  <label className="modal__label">
                    Tên môn thi:
                    <input
                      type="text"
                      name="exam_subject_name"
                      className="modal__input"
                      value={formData.exam_subject_name}
                      onChange={handleChange}
                      placeholder="Nhập tên môn thi"
                    />
                    {errors.exam_subject_name && (
                      <p className="error">{errors.exam_subject_name}</p>
                    )}
                  </label>

                  <label className="modal__label">
                    Thời gian bắt đầu:
                    <input
                      type="text"
                      name="exam_session_time_start"
                      className="modal__input"
                      value={formData.exam_session_time_start}
                      onChange={handleChange}
                      placeholder="YYYY-MM-DD HH:mm:ss"
                    />
                    {errors.exam_session_time_start && (
                      <p className="error">{errors.exam_session_time_start}</p>
                    )}
                  </label>

                  <label className="modal__label">
                    Thời gian kết thúc:
                    <input
                      type="text"
                      name="exam_session_time_end"
                      className="modal__input"
                      value={formData.exam_session_time_end}
                      onChange={handleChange}
                      placeholder="YYYY-MM-DD HH:mm:ss"
                    />
                    {errors.exam_session_time_end && (
                      <p className="error">{errors.exam_session_time_end}</p>
                    )}
                  </label>
                </div>

                <div className="modal__button">
                  <button type="submit" className="modal__button-add">
                    Cập nhật
                  </button>
                  <button
                    type="button"
                    className="modal__cancel"
                    onClick={closeModal}
                  >
                    Huỷ bỏ
                  </button>
                </div>
              </form>
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

export default ManageExamRoomDetail;
