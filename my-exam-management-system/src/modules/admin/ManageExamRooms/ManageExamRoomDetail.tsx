import React, { useEffect, useState } from "react";
import "./ManageExamRoomDetail.scss";
import { Table } from "@components/Table/Table";
import useAuth from "@hooks/AutherHooks";
import { useLocation, useParams } from "react-router-dom";
import { Notification } from "@components/index";

import { ExamRoom } from "@interfaces/ExamRoomInterfaces/ExamRoomInterfaces";
import { ErrorExamRoom } from "@interfaces/ExamRoomInterfaces/ErrorExamRoomInterfaces";
import {
  editExamRoom,
  // getExamRoomDetail,
} from "@/services/repositories/ExamRoomService/ExamRoomService";

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
      // const result = await getExamRoomDetail(room.id);
      // console.log("Room Detail", result);
      // console.log("ExamRoom Data:", result.data);

      // if (result.success) {
      //   const examRoom = result.data?.examRoom;
      //   console.log("examRoom", examRoom);
      //   const id = examRoom.id;
      //   console.log("ExamRoom ID:", examRoom?.id);

      //   const exam_sessions = result.data?.exam_sessions;
      //   const exam_subjects = result.data?.exam_subjects;
      //   const exam_session_name = exam_sessions[0]?.name || "Chưa có ca thi";
      //   const exam_subject_name = exam_subjects[0]?.name || "Chưa có môn thi";
      //   const exam_session_time_start =
      //     exam_sessions[0]?.time_start || "Chưa có thời gian";
      //   const exam_session_time_end =
      //     exam_sessions[0]?.time_end || "Chưa có thời gian";

      //   const examRoomArray = Object.entries(examRoom).map(([key, value]) => ({
      //     key,
      //     value,
      //   }));

      //   setRoomDetail({
      //     id,
      //     exam_session_name,
      //     exam_subject_name,
      //     exam_session_time_start,
      //     exam_session_time_end,
      //     examRoom: examRoomArray,
      //   });
      //   setError("");
      // } else {
      //   setError(result.message || "Lỗi khi lấy thông tin phòng thi.");
      // }
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
        exam_session_time_end: roomDetail.exam_session_time_end,
      }
    : {};

  useEffect(() => {
    loadExamRoomDetail();
  }, []);

  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const [formData, setFormData] = useState<ExamRoom>({
    id: "",
    name: "",
    candidates_count: 0,
    exam_subject_name: "",
    exam_session_name: "",
    exam_session_time_start: "",
    exam_session_time_end: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorExamRoom>({});

  const openEditModal = (data: ExamRoom) => {
    console.log("ExamRoomData", data);
    if (!data.id) {
      console.error("ID của phòng thi không tồn tại trong dữ liệu", data);
    }

    setFormData({
      id: data.id ,
      name: data.name,
      candidates_count: data.candidates_count,
      exam_session_name: data.exam_session_name,
      exam_subject_name: data.exam_subject_name,
      exam_session_time_start: data.exam_session_time_start,
      exam_session_time_end: data.exam_session_time_end,
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
      errors.exam_session_time_start = "Thời gian bắt đầu không được để trống.";
    if (!formData.exam_session_time_end)
      errors.exam_session_time_end = "Thời gian kết thúc không được để trống.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   if (validate()) {
     // Kiểm tra xem formData có ID hợp lệ không
     if (!formData.id) {
       addNotification("ID phòng thi không hợp lệ", false);
       return;
     }

     console.log("Submitting exam room with ID:", formData.id);
     console.log(formData);

     try {
       const result = await editExamRoom(formData.id, formData);
       if (result.success) {
         setRoomDetail((prevDetail: any) => ({
           ...prevDetail,
           id: formData.id,
           name: formData.name,
           candidates_count: formData.candidates_count,
           exam_session_name: formData.exam_session_name,
           exam_subject_name: formData.exam_subject_name,
           exam_session_time_start: formData.exam_session_time_start,
           exam_session_time_end: formData.exam_session_time_end,
         }));
         addNotification("Cập nhật thành công!", true);
         closeModal();
       } else {
         addNotification(result.message || "Cập nhật không thành công!", false);
       }
     } catch (error) {
       addNotification("Lỗi khi cập nhật phòng thi", false);
       console.error("Error updating exam room:", error);
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
  const title = [
    "Ca thi",
    "Môn thi",
    "Thời gian bắt đầu",
    "Thời gian kết thúc",
    "Thao tác",
  ];

  return (
    <div className="room__container">
      <div className="room__title">
        <h1>
          Chi tiết phòng thi{" "}
          {roomDetail?.examRoom ? `(${roomDetail.examRoom[2]?.value})` : ""}
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
                    Thời gian bắt đầu: <br />
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
                  <label className="modal__label">
                    Thời gian kết thúc: <br />
                    <input
                      type="test"
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
