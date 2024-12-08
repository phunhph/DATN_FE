import React, { useEffect, useState } from "react";
import { Table } from "@components/Table/Table";
import { useLocation, useNavigate } from "react-router-dom";
import { Notification } from "@components/index";
import {
  UpdateExamRoom,
  ExamRoomDetailItem,
} from "@interfaces/ExamRoomInterfaces/ExamRoomInterfaces";
import {
  editExamRoom,
  getExamRoomDetail,
  getDataSelectUpdate,
} from "@/services/repositories/ExamRoomService/ExamRoomService";
import { useAdminAuth } from "@hooks/AutherHooks";
import { ErrorExamRoom } from "@interfaces/ExamRoomInterfaces/ErrorExamRoomInterfaces";
import { applyTheme } from "@/SCSS/applyTheme";

const ManageExamRoomDetail: React.FC = () => {
  // interface ExamSubjectType {
  //   id: string;
  //   name: string;
  //   time_start: string | null;
  //   time_end: string | null;
  //   exam_date: string | null;
  // }

  // interface ExamSessionType {
  //   id: string;
  //   name: string;
  //   time_start: string;
  //   time_end: string;
  // }
  applyTheme()

  useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.room;

  const [roomDetail, setRoomDetail] = useState<ExamRoomDetailItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [notifications, setNotifications] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorExamRoom>({});
  const [currentSubjectId, setCurrentSubjectId] = useState<string>("");
  const [formData, setFormData] = useState<UpdateExamRoom | undefined>({
    exam_room: {
      id: "",
      name: "",
      exam_room_detail: {
        id: "",
        exam_room_id: "",
        exam_session_id: "",
        exam_subject_id: "",
        exam_date: "",
      },
    },
    exam_sessions: [],
    exam: [],
    exam_subjects: [],
    exam_date: "",
  });
  const [examSession, setExamSession] = useState();
  const title = [
    "Id môn thi",
    "Môn thi",
    "Thời gian bắt đầu",
    "Thời gian kết thúc",
    "Ngày thi",
    "Ca thi",
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
        const { exam_room_details, exam_sessions, exam_subjects } =
          result.data;
        setExamSession(exam_sessions);
        setRoomDetail(
          exam_subjects.map((subject) => ({
            exam_subject_id: subject.id,
            exam_subject_name: subject.name,
            time_start: subject.time_start || "Chưa có thời gian",
            time_end: subject.time_end || "Chưa có thời gian",
            exam_date: subject.exam_date || "Chưa có ngày thi",
            exam_session_name:
              exam_room_details.find(
                (detail) => detail.exam_subject_id === subject.id
              )?.exam_session.name || "Chưa có ca thi",
          }))
        );
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
    console.log("Running validate with formData:", formData);

    if (!formData) {
      console.log("FormData is undefined in validate");
      return false;
    }

    const newErrors: ErrorExamRoom = {};

    const { exam_date, exam_session_id } = formData.exam_room.exam_room_detail;

    if (!exam_date) {
      newErrors.exam_date = "Ngày thi không được để trống";
    }

    if (!exam_session_id) {
      newErrors.exam_session = "Ca thi không được để trống";
    }

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");

    if (!validate()) {
      console.log("Validation failed");
      return;
    }

    if (!formData) {
      console.log("No form data");
      return;
    }

    console.log("Validation passed");

    const data = {
      exam_room_id: room.id,
      exam_subject_id: currentSubjectId,
      exam_session_id: formData.exam_room.exam_room_detail.exam_session_id,
      exam_date: formData.exam_room.exam_room_detail.exam_date,
    };

    console.log("Data to be submitted:", data);

    try {
      if (!data.exam_session_id || !data.exam_date || !data.exam_subject_id) {
        console.log("Missing required fields");
        addNotification("Vui lòng điền đầy đủ thông tin!", false);
        return;
      }

      const result = await editExamRoom(room.id, data);
      console.log("API response:", result);

      if (result.success) {
        addNotification("Cập nhật thành công!", true);
        closeModal();
        await loadExamRoomDetail();
      } else {
        addNotification(result.message || "Cập nhật không thành công!", false);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật phòng thi:", error);
      addNotification("Lỗi khi cập nhật phòng thi", false);
    }
  };
  useEffect(() => {
    console.log("formData changed:", formData);
  }, [formData]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log("handleChange - name:", name, "value:", value);

    setFormData((prev) => {
      if (!prev) {
        console.log("Previous formData is undefined");
        return prev;
      }

      const updatedFormData = {
        ...prev,
        exam_room: {
          ...prev.exam_room,
          exam_room_detail: {
            ...prev.exam_room.exam_room_detail,
          },
        },
      };

      switch (name) {
        case "exam_date":
          updatedFormData.exam_room.exam_room_detail.exam_date = value;
          break;

        case "exam_sessions":
          updatedFormData.exam_room.exam_room_detail.exam_session_id = value;
          break;
      }

      console.log("Updated formData:", updatedFormData);
      return updatedFormData;
    });
  };

  const openEditModal = async (data: ExamRoomDetailItem) => {
    console.log("id =", data.exam_subject_id);

    if (!data.exam_subject_id) {
      addNotification("Không tìm thấy thông tin phòng thi", false);
      return;
    }
    try {
      setCurrentSubjectId(data.exam_subject_id);
      const result = await getDataSelectUpdate(room, data.exam_subject_id);
      console.log("phần hiển thi update:", result.data);
      if (result.data) {
        setFormData(result.data);
        console.log("FormData set in modal:", result.data);
      }
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error loading modal data:", error);
      addNotification("Lỗi khi tải dữ liệu", false);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setErrors({});
    setCurrentSubjectId(""); // Reset subject_id khi đóng modal
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
      {roomDetail.length > 0 && (
        <Table
          title={title}
          tableName="Chi tiết phòng thi"
          data={roomDetail}
          actions_edit={{
            name: "Chỉnh sửa",
            onClick: (item) => openEditModal(item),
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
                    Ngày thi:
                    <input
                      type="date"
                      name="exam_date"
                      className="modal__input"
                      onChange={handleChange}
                      value={
                        formData?.exam_room.exam_room_detail.exam_date || ""
                      } // Thêm value
                    />
                    {errors.exam_date && (
                      <p className="error">{errors.exam_date}</p>
                    )}
                  </label>
                </div>

                <div className="modal__firstline">
                  <label className="modal__label">
                    Ca thi:
                    <select
                      name="exam_sessions"
                      className="modal__input"
                      onChange={handleChange}
                      value={
                        formData?.exam_room.exam_room_detail.exam_session_id ||
                        ""
                      } // Thêm value
                    >
                      <option value="">Chọn ca thi</option>
                      {examSession?.map((session) => (
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
