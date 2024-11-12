import React, { useEffect, useState } from "react";
import "./ManageExamRoomDetail.scss";
import { Table } from "@components/Table/Table";
import useAuth from "@hooks/AutherHooks";
import { useLocation, useParams } from "react-router-dom";
import { Notification } from "@components/index";

import { ExamRoom } from "@interfaces/ExamRoomInterfaces/ExamRoomInterfaces";
import { ErrorExamRoom } from "@interfaces/ExamRoomInterfaces/ErrorExamRoomInterfaces";
import { editExamRoom, getExamRoomDetail } from "@/services/repositories/ExamRoomService/ExamRoomService";

const ManageExamRoomDetail = () => {
  useAuth();
  const location = useLocation();
  const room = location.state?.room;
  const [roomDetail, setRoomDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);

  const loadExamRoomDetail = async () => {
    setLoading(true);
    try {
      console.log(room);
      
      const result = await getExamRoomDetail(room.id);
      console.log("Room Detail", result);
      if (result.success) {
        const {
          exam_session_name,
          exam_subject_name,
          exam_session_time_start = result.data.data["exam_session_time-start"],
          examSessionTimeEnd,
          examRoom,
        } = result.data.data;

        const examRoomArray = Object.entries(examRoom).map(([key, value]) => ({
          key,
          value,
        }));

        setRoomDetail({
          exam_session_name,
          exam_subject_name,
          exam_session_time_start,
          examSessionTimeEnd,
          examRoom: examRoomArray,
        });
        setError("");
      } else {
        setError(result.message || "Lỗi khi lấy thông tin phòng thi.");
      }
    } catch (error) {
      setError("Lỗi khi tải thông tin phòng thi.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRoomDetail = roomDetail
    ? {
        exam_session_name: roomDetail.exam_session_name,
        exam_subject_name: roomDetail.exam_subject_name,
        exam_session_time_start: roomDetail.exam_session_time_start,
      }
    : {};

  useEffect(() => {
    loadExamRoomDetail();
  }, [room]);

  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const [formData, setFormData] = useState<ExamRoom>({
    id: 0,
    Name: "",
    exam_id: "",
    created_at: "",
    updated_at: "",
    candidates_count: 0,
    exam_subject_name: "",
    exam_session_name: "",
    exam_session_time_start: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorExamRoom>({});

  const openEditModal = (data: ExamRoom) => {
    setFormData({
      id: data.id,
      name: data.name,
      exam_id: data.exam_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      candidates_count: data.candidates_count,
      exam_session_name: data.exam_session_name,
      exam_subject_name: data.exam_subject_name,
      exam_session_time_start: data.exam_session_time_start,
    });
    setEditMode(true);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditMode(false);
    setErrors({});
  };

  const validate = (): boolean => {
    const errors: ErrorExamRoom = {};
    if (!formData.exam_session_name)
      errors.exam_session_name = "Ca thi không được để trống.";
    if (!formData.exam_subject_name)
      errors.exam_subject_name = "Tên môn thi không được để trống.";
    if (!formData.exam_session_time_start)
      errors.exam_session_time_start = "Ngày thi không được để trống.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      console.log("Submitting exam room with ID:", formData.id);
      const result = await editExamRoom(formData.id, formData);
      if (result.success) {
        setRoomDetail((prevDetail:any) => ({
          ...prevDetail,
          id: formData.id,
          Name: formData.name,
          exam_id: formData.exam_id,
          created_at: formData.created_at,
          updated_at: formData.updated_at,
          candidates_count: formData.candidates_count,
          exam_session_name: formData.exam_session_name,
          exam_subject_name: formData.exam_subject_name,
          exam_session_time_start: formData.exam_session_time_start,
        }));
        addNotification("Cập nhật thành công!", true);
        closeModal();
      } else {
        addNotification(result.message || "Cập nhật không thành công!", false);
      }
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
   const title = ["Ca thi", "Môn thi", "Thời gian bắt đầu"];

  return (
    <div className="room__container">
      <div className="room__title">
        <h1>
          Chi tiết phòng thi{" "}
          {roomDetail?.examRoom ? `(${roomDetail.examRoom[1]?.value})` : ""}
        </h1>
      </div>
      {loading ? (
        <p>Loading exam room details...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        roomDetail && (
          <Table
          title={title}
            tableName="Chi tiết phòng thi"
            data={[filteredRoomDetail]}
            actions_edit={{
              name: "Chỉnh sửa",
              onClick: (exam) => {
                if (exam) {
                  openEditModal(exam);
                }
              },
            }}
          />
        )
      )}

      {modalIsOpen && (
        <div className="modal">
          <div className="modal__overlay">
            <div className="modal__content">
              <button className="modal__close" onClick={closeModal}>
                X
              </button>
              <h2 className="modal__title">Chỉnh sửa môn thi</h2>
              <form className="modal__form" onSubmit={handleSubmit}>
                <div className="modal__firstline">
                  <label className="modal__label">
                    Ca thi: <br />
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
                    Tên môn thi: <br />
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
                    Ngày giờ thi: <br />
                    <input
                      type="test"
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
