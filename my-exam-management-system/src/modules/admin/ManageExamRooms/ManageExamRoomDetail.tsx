import { applyTheme } from "@/SCSS/applyTheme";
import {
  editExamRoom,
  getDataSelectUpdate,
  getExamRoomDetail,
} from "@/services/repositories/ExamRoomService/ExamRoomService";
import { Button, Notification, PageTitle } from "@components/index";
import { Table } from "@components/Table/Table";
import { useAdminAuth } from "@hooks/AutherHooks";
import { ErrorExamRoom } from "@interfaces/ExamRoomInterfaces/ErrorExamRoomInterfaces";
import { ExamRoomDetailItem } from "@interfaces/ExamRoomInterfaces/ExamRoomInterfaces";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ManageExamRoomDetail.scss";

const ManageExamRoomDetail: React.FC = () => {
  applyTheme();

  useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.room;

  const [roomDetail, setRoomDetail] = useState<ExamRoomDetailItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorExamRoom>({});
  const [currentSubjectId, setCurrentSubjectId] = useState<string>("");
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const title = [
    "Id môn thi",
    "Môn thi",
    "Ca thi",
    "Thời gian bắt đầu",
    "Thời gian kết thúc",
    "Ngày bắt đầu",
    "Ngày kết thúc",
    "Thao tác",
  ];

  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  function convertToLocalDate(dateStr: string | undefined): string {
    if (!dateStr) return ""; // Return an empty string if date is null or undefined

    // Convert the date string to a Date object, assuming it's in UTC
    const dateUTC = new Date(dateStr + " UTC");

    // Format the date as YYYY-MM-DD
    const localDate = dateUTC.toLocaleDateString("en-CA"); // en-CA is the locale that gives YYYY-MM-DD format

    return localDate;
  }

  const loadExamRoomDetail = async () => {
    if (!room?.id) {
      setError("Không tìm thấy thông tin phòng thi");
      setLoading(false);
      return;
    }

    try {
      const result = await getExamRoomDetail(room.id);
      if (result.success && result.data) {
        const { exam_room_details, exam_sessions, exam_subjects } = result.data;
        console.log(result.data);
        setSessionList(exam_sessions); // danh sách ca thi để update
        console.log("thời gian kết thúc", exam_subjects);
        setRoomDetail(
          exam_subjects.map((subject) => {
            const examRoomDetail = exam_room_details.find(
              (detail) => detail.exam_subject_id === subject.id
            );

            console.log(subject);
            return {
              exam_subject_id: subject.id,
              exam_subject_name: subject.name,
              exam_session_name:
                examRoomDetail?.exam_session?.name || "Chưa có tên ca thi",
              time_start: subject.time_start || "Chưa có thời gian",
              time_end: subject.time_end || "Chưa có thời gian",
              exam_date:
                convertToLocalDate(subject.exam_date) || "Chưa có ngày thi",
              exam_end:
                convertToLocalDate(subject.exam_end) || "Chưa có ngày thi",
            };
          })
        );
        setError("");
      } else {
        setError(result.message || "Lỗi khi lấy thông tin phòng thi");
      }
    } catch (err) {
      setError("Lỗi khi tải thông tin phòng thi");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!room) {
      navigate("/admin/manage-exam-rooms");
      return;
    }
    console.log("roomDetail", roomDetail);
    loadExamRoomDetail();
  }, [room, navigate]);

  // const validate = (): boolean => {
  //   console.log("Running validate with formData:", formData);

  //   if (!formData) {
  //     console.log("FormData is undefined in validate");
  //     return false;
  //   }

  //   const newErrors: ErrorExamRoom = {};

  //   const { exam_date, exam_session_id } = formData.exam_room.exam_room_detail;

  //   if (!exam_date) {
  //     newErrors.exam_date = "Ngày thi không được để trống";
  //   }

  //   if (!exam_end) {
  //     newErrors.exam_end = "Ngày thi không được để trống";
  //   }

  //   if (!exam_session_id) {
  //     newErrors.exam_session = "Ca thi không được để trống";
  //   }

  //   console.log("Validation errors:", newErrors);
  //   setErrors(newErrors);

  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Form submitted");

  //   if (!validate()) {
  //     console.log("Validation failed");
  //     return;
  //   }

  //   if (!formData) {
  //     console.log("No form data");
  //     return;
  //   }

  //   const data = {
  //     exam_room_id: room.id,
  //     exam_subject_id: currentSubjectId,
  //     exam_session_id: formData.exam_room.exam_room_detail.exam_session_id,
  //     exam_date: formData.exam_room.exam_room_detail.exam_date,
  //     exam_end: formData.exam_room.exam_room_detail.exam_end,
  //   };

  //   console.log("Data to be submitted:", data);

  //   try {
  //     if (!data.exam_session_id || !data.exam_date || !data.exam_subject_id) {
  //       console.log("Missing required fields");
  //       addNotification("Vui lòng điền đầy đủ thông tin!", false);
  //       return;
  //     }

  //     const result = await editExamRoom(room.id, data);
  //     console.log("API response:", result);

  //     if (result.success) {
  //       addNotification("Cập nhật thành công!", true);
  //       closeModal();
  //       await loadExamRoomDetail();
  //     } else {
  //       addNotification(result.message || "Cập nhật không thành công!", false);
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi cập nhật phòng thi:", error);
  //     addNotification("Lỗi khi cập nhật phòng thi", false);
  //   }
  // };

  // useEffect(() => {
  //   console.log("formData changed:", formData);
  // }, [formData]);

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   console.log("handleChange - name:", name, "value:", value);

  //   setFormData((prev) => {
  //     if (!prev) {
  //       console.log("Previous formData is undefined");
  //       return prev;
  //     }

  //     const updatedFormData = {
  //       ...prev,
  //       exam_room: {
  //         ...prev.exam_room,
  //         exam_room_detail: {
  //           ...prev.exam_room.exam_room_detail,
  //         },
  //       },
  //     };

  //     switch (name) {
  //       case "exam_date":
  //         updatedFormData.exam_room.exam_room_detail.exam_date = value;
  //         break;

  //       case "exam_end":
  //         updatedFormData.exam_room.exam_room_detail.exam_end = value;
  //         break;

  //       case "exam_sessions":
  //         updatedFormData.exam_room.exam_room_detail.exam_session_id = value;
  //         break;
  //     }

  //     console.log("Updated formData:", updatedFormData);
  //     return updatedFormData;
  //   });
  // };

  // const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   console.log("handleEndDateChange - name:", name, "value:", value);

  //   setFormData((prev) => {
  //     if (!prev) {
  //       console.log("Previous formData is undefined");
  //       return prev;
  //     }

  //     const updatedFormData = {
  //       ...prev,
  //       exam_room: {
  //         ...prev.exam_room,
  //         exam_room_detail: {
  //           ...prev.exam_room.exam_room_detail,
  //           exam_end: value, // Update exam_end directly
  //         },
  //       },
  //     };

  //     console.log("Updated formData (exam_end):", updatedFormData);
  //     return updatedFormData;
  //   });
  // };

  const [dateStart, setDateStart] = useState<Date | undefined>(undefined);
  const [dateEnd, setDateEnd] = useState<Date | undefined>(undefined);
  const [sessionSelected, setSessionSelected] = useState<string | undefined>();
  const [sessionList, setSessionList] = useState<any[]>();
  const [selectedOption, setSelectedOption] = useState<"session" | "endDate">(
    "session"
  );

  const openEditModal = async (data: ExamRoomDetailItem) => {
    setCurrentSubjectId(data.exam_subject_id);
    setCurrentSessionId(
      sessionList?.find((session) => session.name == data.exam_session_name)
        ?.id as string
    );
    if (!data.exam_subject_id) {
      addNotification("Không tìm thấy thông tin phòng thi", false);
      return;
    }
    try {
      const result = await getDataSelectUpdate(room, data.exam_subject_id);
      if (!result.data) {
        addNotification(
          "Không tải được dữ liệu phòng thi. Xin vui lòng thử lại sau!",
          false
        );
        return;
      }
      const start = result.data!.exam_room.exam_room_detail.exam_date;
      console.log("start", start);
      const end = result.data!.exam_room.exam_room_detail.exam_end;
      console.log("end", end);
      const oldSession =
        result.data.exam_sessions.length > 0
          ? result.data.exam_sessions?.[0].name
          : "";
      setDateStart(start ? new Date(start) : undefined); // ngày bắt đầu
      setDateEnd(end && end.trim() ? new Date(end) : undefined); //ngày kết thúc
      setSessionSelected(oldSession); // ca thi cũ đã chọn, empty string nếu chưa đc chọn
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error loading modal data:", error);
      addNotification("Đã xảy ra lỗi khi tải dữ liệu", false);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setErrors({});
    setDateStart(undefined);
    setDateEnd(undefined);
    setSessionSelected(undefined);
  };

  if (loading) {
    return (
      <div className="room__container">Đang tải thông tin phòng thi...</div>
    );
  }

  const formatToMySQLDatetime = (date: Date): string => {
    const localDate = new Date(date); // Parse the date string
    const year = localDate.getFullYear();
    const month = (localDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const day = localDate.getDate().toString().padStart(2, "0");
    const hours = localDate.getHours().toString().padStart(2, "0");
    const minutes = localDate.getMinutes().toString().padStart(2, "0");
    const seconds = localDate.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Format: 'YYYY-MM-DD HH:mm:ss'
  };

  const updateCurrentExamRoom = async () => {
    console.log(dateStart, dateEnd, sessionSelected);
    if (!errors.exam_date && !errors.exam_end && !errors.exam_session_name) {
      try {
        const formattedExamDate = formatToMySQLDatetime(dateStart!);
        const formattedExamEnd = formatToMySQLDatetime(dateEnd!);

        const data = {
          exam_room_id: room.id,
          exam_subject_id: currentSubjectId,
          exam_date: formattedExamDate,
          exam_session_id:
            selectedOption === "session" ? currentSessionId : undefined,
          exam_end: selectedOption === "endDate" ? formattedExamEnd : undefined,
        };
        console.log(data);
        const result = await editExamRoom(room.id, data);
        console.log("API response:", result);

        if (result.success) {
          addNotification("Cập nhật thành công!", true);
          closeModal();
          await loadExamRoomDetail();
        } else {
          addNotification(
            result.message || "Cập nhật không thành công!",
            false
          );
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật phòng thi:", error);
        addNotification("Lỗi khi cập nhật phòng thi", false);
      }
    }
  };

  return (
    <div className="room__container">
      <PageTitle theme="light" showBack>
        Quản lý phòng thi
      </PageTitle>
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
            <div className="modal__content" style={{ width: "700px" }}>
              <button className="modal__close" onClick={closeModal}>
                ×
              </button>
              <h2 className="modal__title">Chỉnh sửa thông tin phòng thi</h2>

              <form className="modal__form">
                <div className="modal__firstline">
                  <label className="modal__label">
                    <input
                      type="radio"
                      checked={selectedOption === "session"}
                      onChange={() => setSelectedOption("session")}
                    />
                    Chọn ngày bắt đầu và ca thi
                  </label>
                  <label className="modal__label">
                    <input
                      type="radio"
                      checked={selectedOption === "endDate"}
                      onChange={() => setSelectedOption("endDate")}
                    />
                    Chọn ngày bắt đầu và ngày kết thúc
                  </label>
                  <label className="modal__label">
                    Ngày bắt đầu:
                    <input
                      type="date"
                      name="exam_date"
                      className="modal__input"
                      value={
                        dateStart ? dateStart.toISOString().split("T")[0] : ""
                      }
                      onBlur={() => {
                        if (!dateStart) {
                          setErrors((prev) => ({ ...prev, exam_date: "a" }));
                        } else {
                          setErrors((prev) => ({ ...prev, exam_date: "" }));
                        }
                      }}
                      onChange={(e) => {
                        const newDate = e.target.value
                          ? new Date(e.target.value)
                          : undefined;
                        setDateStart(newDate);
                        if (!dateStart) {
                          setErrors((prev) => ({ ...prev, exam_date: "a" }));
                        } else {
                          setErrors((prev) => ({ ...prev, exam_date: "" }));
                        }
                      }}
                    />
                    {errors.exam_date && (
                      <p className="input_error">
                        Ngày bắt đầu không được bỏ trống
                      </p>
                    )}
                  </label>
                </div>
                {selectedOption === "session" && (
                  <div className="modal__firstline">
                    <label className="modal__label">
                      Ca thi:
                      <select
                        name="exam_sessions"
                        className="modal__input"
                        value={
                          sessionList?.find(
                            (session) => session.name === sessionSelected
                          )?.id || ""
                        }
                        onBlur={() => {
                          if (sessionSelected === "") {
                            setErrors((prev) => ({
                              ...prev,
                              exam_session: "Ngày bắt đầu không được bỏ trống",
                            }));
                          } else {
                            setErrors((prev) => ({
                              ...prev,
                              exam_session: "",
                            }));
                          }
                        }}
                        onChange={(e) => {
                          console.log(e.target.value);
                          const selectedSession =
                            sessionList?.find(
                              (session) => session.id == e.target.value
                            ) || null;
                          setSessionSelected(
                            selectedSession ? selectedSession.name : ""
                          );
                          setCurrentSessionId(e.target.value);
                        }}
                      >
                        {!sessionList?.find(
                          (session) => session.name === sessionSelected
                        )?.id && <option value="">Chọn ca thi</option>}
                        {sessionList?.map((session) => (
                          <option key={session.id} value={session.id}>
                            {session.name}
                          </option>
                        ))}
                      </select>
                      {errors.exam_session && (
                        <p className="input_error">{errors.exam_session}</p>
                      )}
                    </label>
                  </div>
                )}
                {selectedOption === "endDate" && (
                  <div className="modal__firstline">
                    <label className="modal__label">
                      Ngày kết thúc:
                      <input
                        type="date"
                        name="exam_end"
                        className="modal__input"
                        value={
                          dateEnd ? dateEnd.toISOString().split("T")[0] : ""
                        }
                        onChange={(e) => {
                          const newDate = e.target.value
                            ? new Date(e.target.value)
                            : undefined;
                          if (newDate && dateStart && newDate < dateStart) {
                            addNotification(
                              "Ngày kết thúc không thể sớm hơn ngày bắt đầu!",
                              false
                            );
                            return;
                          }
                          setDateEnd(newDate);
                        }}
                      />
                    </label>
                  </div>
                )}
                <div className="modal__button">
                  <Button
                    type="button"
                    style={{ color: "white", marginRight: "1rem" }}
                    onClick={updateCurrentExamRoom}
                  >
                    Cập nhật
                  </Button>
                  <Button
                    type="button"
                    onClick={closeModal}
                    style={{ color: "white" }}
                  >
                    Huỷ bỏ
                  </Button>
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
