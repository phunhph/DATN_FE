import { Button, PageTitle, Table } from "@/components";
import { SessionCreate } from "@/interfaces/SessionInterface/SessionInterface";
import {
  addSession,
  getAllSession,
  updateSession,
} from "@/services/repositories/SessionService/SessionService";
import { SessionType } from "./ManageExamSessions.type";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ManageExamSessions = () => {
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [animateOut, setAnimateOut] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);
  const [sessionList, setSessionList] = useState<any>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editSession, setEditSession] = useState<SessionType | null>(null);

  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const title = [
    "Mã ca thi",
    "Ca thi",
    "Thời gian bắt đầu",
    "Thời gian kết thúc",
    "Trạng thái",
    "Thao tác",
  ];

  const sortedData = sessionList
    .filter((item) => item.id && item.name && item.time_start && item.time_end)
    .map((item) => ({
      id: item.id,
      name: item.name,
      timeStart: item.time_start,
      timeEnd: item.time_end,
      status: item.status,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await getAllSession();
      if (
        response.success &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setSessionList(response.data.data);
      } else {
        console.error("Invalid data format received from the API");
      }
    };
    fetchSessions();
  }, []);

  const statusOptions = [
    { value: 0, label: "Chưa bắt đầu" },
    { value: 1, label: "Đang diễn ra" },
    { value: 2, label: "Đã kết thúc" },
  ];

  const emptyFormValue: SessionType = {
    sessionName: "",
    status: 0,
    sessionStart: "",
    sessionEnd: "",
  };

  const handleUpdateStatus = (id: string) => {
    setSessionList((prevContents) =>
      prevContents.map((content) =>
        content.id === id ? { ...content, status: !content.status } : content
      )
    );
    addNotification(`Trạng thái của môn thi đã được thay đổi.`, true);
  };

  const handleStatusChange = (id: string) => {
    if (confirm("Are you sure you want to change the status?")) {
      handleUpdateStatus(id);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm<SessionType>();

  const handleCreateSession = async () => {
    const formData = getValues();
    const newSession: SessionCreate = {
      name: formData.name,
      time_start: formData.time_start,
      time_end: formData.time_end,
      status: formData.status ?? 0,
    };

    const result = await addSession(newSession);
    if (result.success === true) {
      setSessionList((prevList) => [...prevList, newSession]);
      addNotification("Thêm mới môn thi thành công!", true);
    } else {
      addNotification(
        result.message ?? "Thêm mới môn thi thất bại",
        result.success
      );
    }
  };

  const handleUpdateSession = async () => {
    const formData = getValues();

    if (!editSession?.id) {
      addNotification("Không tìm thấy ID của ca thi để cập nhật.", false);
      return;
    }

    const updatedSession: SessionCreate = {
      id: editSession.id,
      name: formData.name,
      time_start: formData.time_start,
      time_end: formData.time_end,
      status: formData.status ?? 0,
    };

    const result = await updateSession(updatedSession);

    if (result.success) {
      setSessionList((prevList) =>
        prevList.map((session) =>
          session.id === updatedSession.id ? updatedSession : session
        )
      );
      addNotification("Cập nhật ca thi thành công!", true);
    } else {
      addNotification(
        result.message ?? "Cập nhật ca thi thất bại",
        result.success
      );
    }
  };

  const openEditForm = (session: SessionType) => {
    setIsEditing(true);
    setEditSession(session);
    setOpenForm(true);
    setValue("name", session.name);
    setValue("time_start", session.time_start);
    setValue("time_end", session.time_end);
    setValue("status", session.status);
  };

  const openAddExamSessionForm = () => {
    setOpenForm(true);
    setIsEditing(false);
    reset(emptyFormValue);
  };

  const closeAddExamSessionForm = () => {
    setAnimateOut(true);
    reset(emptyFormValue);
    setTimeout(() => {
      setAnimateOut(false);
      setOpenForm(false);
    }, 300);
  };

  const downloadSample = () => {
    const link = document.createElement("a");
    link.href = `public/excel/Exam-Subject.xlsx`;
    link.download = "Exam-Subject.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

 

  return (
    <div className="examSessions__container">
      <PageTitle theme="light">Quản lý ca thi</PageTitle>
      <Table
        title={title}
        data={sortedData}
        tableName="Ca thi"
        actions_add={{ name: "Thêm ca thi", onClick: openAddExamSessionForm }}
        actions_edit={{
          name: "Sửa",
          onClick: (id) => {
            const sessionToEdit = sessionList.find(
              (session:any) => session.id === id
            );
            if (sessionToEdit) {
              openEditForm(sessionToEdit);
            }
          },
        }}
        action_dowload={{ name: "Tải mẫu", onClick: downloadSample }}
        action_status={handleStatusChange}
      />
      <div className={`semester ${openForm ? "" : "hidden"}`}>
        {openForm && (
          <div
            className={`semester__overlay ${
              animateOut ? "fade-out" : "fade-in"
            }`}
          >
            <div className="semester__overlay-content">
              <Button
                type="button"
                className="btn btn-close"
                onClick={closeAddExamSessionForm}
              >
                X
              </Button>
              <form
                onSubmit={handleSubmit(
                  isEditing ? handleUpdateSession : handleCreateSession
                )}
                className="examSessions__form"
              >
                <h4>{isEditing ? "Sửa ca thi" : "Thêm ca thi"}</h4>
                <div className="form__group">
                  <label htmlFor="sessionName" className="form__label">
                    Tên ca thi:
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form__input"
                    {...register("name", {
                      required: "Tên ca thi là bắt buộc",
                    })}
                    defaultValue={isEditing ? editSession?.name : ""}
                  />
                  <div className="form__error">
                    {errors.name && (
                      <span>{errors.name.message}</span>
                    )}
                  </div>
                </div>
                <div className="form__group">
                  <label htmlFor="sessionStart" className="form__label">
                    Thời gian bắt đầu:
                  </label>
                  <input
                    id="time_start"
                    type="date"
                    className="form__input"
                    {...register("time_start", {
                      required: "Thời gian bắt đầu là bắt buộc",
                    })}
                    defaultValue={isEditing ? editSession?.time_start : ""}
                  />
                  <div className="form__error">
                    {errors.time_start && (
                      <span>{errors.time_start.message}</span>
                    )}
                  </div>
                </div>
                <div className="form__group">
                  <label htmlFor="sessionEnd" className="form__label">
                    Thời gian kết thúc:
                  </label>
                  <input
                    id="time_end"
                    type="date"
                    className="form__input"
                    {...register("time_end", {
                      required: "Thời gian kết thúc là bắt buộc",
                    })}
                    defaultValue={isEditing ? editSession?.time_end : ""}
                  />
                  <div className="form__error">
                    {errors.time_end && (
                      <span>{errors.time_end.message}</span>
                    )}
                  </div>
                </div>
                <div className="btn-group">
                  <Button
                    type="reset"
                    className="btn btn-reset"
                    onClick={() => reset(emptyFormValue)}
                  >
                    Đặt lại
                  </Button>
                  <Button type="submit" className="btn btn-submit">
                    {isEditing ? "Cập nhật" : "Tạo mới"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageExamSessions;
