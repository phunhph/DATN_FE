import React, { useEffect, useState } from "react";
import "./ManageExamRoomDetail.scss";
import { Table } from "@components/Table/Table";
import { useLocation, useNavigate } from "react-router-dom";
import { Notification } from "@components/index";
import {
  UpdateExamRoom,
  ExamRoomDetailTables,
} from "@interfaces/ExamRoomInterfaces/ExamRoomInterfaces";
import {
  editExamRoom,
  getExamRoomDetail,
  getDataSelectUpdate,
} from "@/services/repositories/ExamRoomService/ExamRoomService";
import { useAdminAuth } from "@hooks/AutherHooks";
import { ErrorExamRoom } from "@interfaces/ExamRoomInterfaces/ErrorExamRoomInterfaces";

import "./ManageExamRoomDetail.scss";

const ManageExamRoomDetail = () => {
  interface ExamSubjectType {
    id: string;
    name: string;
  }

  interface ExamSessionType {
    id: string;
    name: string;
    time_start: string;
    time_end: string;
  }

  useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.room;

  const [roomDetail, setRoomDetail] = useState<ExamRoomDetailTables[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);
  // const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorExamRoom>({});
  const [formData, setFormData] = useState<UpdateExamRoom | undefined>({
    exam_room: {
      id: "",
      exam_id: "",
      name: "",
      exam_room_detail: {
        id: "",
        exam_room_id: "",
        exam_session_id: "",
      },
    },
    exam_sessions: [],
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
        const { examRoom, exam_room_details, exam_sessions, exam_subjects } =
          result.data;

        // Format dữ liệu giữ nguyên các trường như cũ
        const formattedData = exam_room_details.map((detail: any) => {
          const subject = exam_subjects.find(
            (subject: ExamSubjectType) =>
              subject.id.toString() === detail.exam_subject_id.toString()
          );

          const session = exam_sessions.find(
            (session: ExamSessionType) =>
              session.id.toString() === detail.exam_session_id.toString()
          );

          return {
            exam_id: examRoom.id,
            name: examRoom.name,
            exam_session_name: session?.name || "Chưa có ca thi",
            exam_subject_name: subject?.name || "Chưa có môn thi",
            exam_session_time_start: session?.time_start || "Chưa có thời gian",
            exam_session_time_end: session?.time_end || "Chưa có thời gian",
          } as ExamRoomDetailTables; // Thêm type assertion
        });

        setRoomDetail(formattedData);
        setError("");
      } else {
        setError(result.message || "Lỗi khi lấy thông tin phòng thi");
      }
    } catch {
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

    if (formData && !formData.exam_room.name) {
      newErrors.name = "Tên phòng thi không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate() || !formData) {
      return;
    }

    const data = {
      name: formData.exam_room.name,
      exam_session_id: formData.exam_room.exam_room_detail.exam_session_id,
    };

    try {
      const result = await editExamRoom(formData.exam_room.id, data);

      if (result.success) {
        addNotification("Cập nhật thành công!", true);
        closeModal();
        await loadExamRoomDetail();
      } else {
        addNotification(result.message || "Cập nhật không thành công!", false);
      }
    } catch (error) {
      addNotification("Lỗi khi cập nhật phòng thi", false);
      console.error("Error updating exam room:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (!prev) return prev;

      const updatedFormData = { ...prev };

      switch (name) {
        case "exam_room_name":
          updatedFormData.exam_room.name = value;
          break;

        case "exam_sessions":
          updatedFormData.exam_room.exam_room_detail.exam_session_id = value;
          break;
      }

      return updatedFormData;
    });
  };

  const openEditModal = async (data: ExamRoomDetailTables) => {
    if (!data.exam_id) {
      addNotification("Không tìm thấy thông tin phòng thi", false);
      return;
    }
    const result = await getDataSelectUpdate(data.exam_id);
    console.log(result.data);
    setFormData(result.data);
    // setEditMode(true);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    // setEditMode(false);
    setErrors({});
  };

  useEffect(() => {
    document.documentElement.className = `admin-light`;
  }, []);

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
  console.log("Room deltail: ", roomDetail);

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
          data={Array.isArray(roomDetail) ? roomDetail : []}
          actions_edit={{
            name: "Chỉnh sửa",
            onClick: (exam) => {
              if (exam) {
                console.log("log exam: ", exam.exam_id);
                openEditModal(exam);
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
                  {/* Input tên phòng */}
                  <label className="modal__label">
                    Tên phòng:
                    <input
                      type="text"
                      name="exam_room_name"
                      className="modal__input"
                      value={formData?.exam_room.name || ""}
                      onChange={handleChange}
                      placeholder="Nhập tên phòng"
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                  </label>

                  {/* Select ca thi */}
                  <label className="modal__label">
                    Ca thi:
                    <select
                      name="exam_sessions"
                      className="modal__input"
                      value={
                        formData?.exam_room.exam_room_detail.exam_session_id ||
                        ""
                      }
                      onChange={handleChange}
                    >
                      <option value="">Chọn ca thi</option>
                      {formData?.exam_sessions?.map((session) => (
                        <option key={session.id} value={session.id}>
                          {session.name}
                        </option>
                      ))}
                    </select>
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
