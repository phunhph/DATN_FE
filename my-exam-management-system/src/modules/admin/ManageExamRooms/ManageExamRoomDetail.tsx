import React, { useEffect, useState } from "react";
import "./ManageExamRoomDetail.scss";
import { Table } from "@components/Table/Table";
import useAuth from "@hooks/AutherHooks";
import { useLocation, useNavigate } from "react-router-dom";
import { Notification } from "@components/index";
import {
  UpdateExamRoom,
  ExamRoomDetailTables,
} from "@interfaces/ExamRoomInterfaces/ExamRoomInterfaces";
import { ErrorExamRoom } from "@interfaces/ExamRoomInterfaces/ErrorExamRoomInterfaces";
import {
  editExamRoom,
  getExamRoomDetail,
  getDataSelectUpdate,
} from "@/services/repositories/ExamRoomService/ExamRoomService";

const ManageExamRoomDetail = () => {
  useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const room = location.state?.room;

  const [roomDetail, setRoomDetail] = useState<ExamRoomDetailTables | null>(
    null
  );
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
        exam_subject_id: "",
        exam_session_id: "",
        exam_date: "",
      },
    },
    exam: [],
    exam_sessions: [],
    exam_subjects: [],
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
        // setFormData(formattedData);
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
      newErrors.name = "Tên ca thi không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Log toàn bộ dữ liệu form để kiểm tra
    const data = {
      name: formData?.exam_room.name,
      exam_id: formData?.exam_room.exam_id,
      exam_session_id: formData?.exam_room.exam_room_detail.exam_session_id,
      exam_subject_id: formData?.exam_room.exam_room_detail.exam_subject_id,
    };
    console.log("Form Data Before Submit:");

    if (!validate() || !formData) {
      return;
    }

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
    console.log("Changing:", name, value); // Log để debug

    setFormData((prev) => {
      if (!prev) return prev;

      // Tạo bản sao của prev để tránh mutate state
      const updatedFormData = { ...prev };

      switch (name) {
        case "exam_room_name":
          updatedFormData.exam_room.name = value;
          break;

        case "exam":
          updatedFormData.exam_room.exam_id = value;
          break;

        case "exam_sessions":
          updatedFormData.exam_room.exam_room_detail.exam_session_id = value;
          break;

        case "exam_subjects":
          updatedFormData.exam_room.exam_room_detail.exam_subject_id = value;
          break;
      }

      console.log("Updated formData:", updatedFormData); // Log để debug
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
          data={[roomDetail]}
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

                  {/* Select kỳ thi */}
                  <label className="modal__label">
                    Kỳ thi:
                    <select
                      name="exam"
                      className="modal__input"
                      value={formData?.exam_room.exam_id || ""}
                      onChange={handleChange}
                    >
                      <option value="">Chọn kỳ thi</option>
                      {formData?.exam?.map((exam) => (
                        <option key={exam.id} value={exam.id}>
                          {exam.name}
                        </option>
                      ))}
                    </select>
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

                  {/* Select môn thi */}
                  <label className="modal__label">
                    Môn thi:
                    <select
                      name="exam_subjects"
                      className="modal__input"
                      value={
                        formData?.exam_room.exam_room_detail.exam_subject_id ||
                        ""
                      }
                      onChange={handleChange}
                    >
                      <option value="">Chọn môn thi</option>
                      {formData?.exam_subjects?.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
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
