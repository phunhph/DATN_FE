/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Notification, PageTitle, Table } from "@/components";
import { SessionCreate } from "@/interfaces/SessionInterface/SessionInterface";
import {
  addSession,
  deleteSession,
  getAllSession,
  updateSession,
} from "@/services/repositories/SessionService/SessionService";
import { SessionType } from "./ManageExamSessions.type";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { applyTheme } from "@/SCSS/applyTheme";
import { useAdminAuth } from "@/hooks";

const ManageExamSessions = () => {
  useAdminAuth();
  applyTheme()

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
    "Thao tác",
  ];

  const sortedData = sessionList
    .filter(
      (item: any) => item.id && item.name && item.time_start && item.time_end
    )
    .map((item: any) => ({
      id: item.id,
      name: item.name,
      timeStart: item.time_start,
      timeEnd: item.time_end,
    }))
    .sort((a: any, b: any) => a.name.localeCompare(b.name));


  const fetchSessions = async () => {
    const response = await getAllSession();
    if (
      response.success &&
      response.data &&
      Array.isArray(response.data)
    ) {
      console.log(response.data)
      setSessionList(response.data);
    } else {
      console.error("Invalid data format received from the API");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const emptyFormValue: SessionType = {
    id: "",
    name: "",
    timeStart: "",
    timeEnd: "",
  };

  const handleUpdateStatus = (id: string) => {
    setSessionList((prevContents: any) =>
      prevContents.map((content: any) =>
        content.id === id ? { ...content } : content
      )
    );
    addNotification(`Trạng thái của môn thi đã được thay đổi.`, true);
  };

  const handleStatusChange = (id: string) => {
    if (confirm("Xác nhận thay đổi trạng thái ?")) {
      handleUpdateStatus(id);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<SessionType>();

  const handleCreateSession = async () => {
    const formData = getValues();
    const newSession: SessionCreate = {
      id: formData.id || "auto-generated-id",
      name: formData.name,
      time_start: formData.timeStart,
      time_end: formData.timeEnd,
    };

    const result = await addSession(newSession);
    console.log(result);

    if (result.success == true) {
      setSessionList((prevList: any) => [...prevList, newSession]);
      addNotification("Thêm mới môn thi thành công!", true);
      closeAddExamSessionForm();
    } else {
      addNotification(
        result.message ?? "Thêm mới môn thi thất bại",
        result.success
      );
    }
  };

  const handleUpdateSession = async () => {
    const formData = getValues();

    if (!formData.id) {
      addNotification("Không tìm thấy ID của ca thi để cập nhật.", false);
      return;
    }

    const updatedSession: SessionCreate = {
      id: formData.id,
      name: formData.name,
      time_start: formData.timeStart,
      time_end: formData.timeEnd,
    };
    const result = await updateSession(updatedSession);

    if (result.success) {
      setSessionList((prevList: any) =>
        prevList.map((session: any) =>
          session.id === updatedSession.id ? updatedSession : session
        )
      );
      addNotification("Cập nhật ca thi thành công!", true);
      closeAddExamSessionForm();
    } else {
      addNotification( "Cập nhật ca thi thất bại",false);
    }
  };

  const openEditForm = (session: SessionType) => {
    setIsEditing(true);
    setEditSession(session);
    setOpenForm(true);
    setValue("id", session.id);
    setValue("name", session.name);
    setValue("timeStart", session.timeStart);
    setValue("timeEnd", session.timeEnd);
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
          onClick: (session: SessionType) => {
            console.log(session)
            // const selectedSession = sortedData.find((session:SessionType) => session.id === id.id);
            // console.log(selectedSession)
            if (session) {
              openEditForm(session);
              console.log(session.timeStart)
            } else {
              addNotification("Chức năng xóa tạm thời không khả dụng. Xin vui lòng thử lại sau", false)
            }
          },
        }}
        // action_status={handleStatusChange}
        actions_detail={{
          name: "Xóa",
          onClick: async (id) => {
            try {
              const isConfirmed = confirm(`Bạn chắc chắn muốn xóa ca thi với mã id ${id} chứ ?`);
              if (isConfirmed) {
                const res = await deleteSession(id);
                if (res) {
                  addNotification("Xóa ca thi với mã id ${id} thành công!", true);
                  fetchSessions();
                } else {
                  addNotification("Xóa ca thi với mã id ${id} thất bại!", false);
                }
              }
            } catch (err) {
              console.error(err);
            }
          }
        }}

      />
      <div className={`semester ${openForm ? "" : "hidden"}`}>
        {openForm && (
          <div
            className={`semester__overlay ${animateOut ? "fade-out" : "fade-in"
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
                  <label htmlFor="sessionId" className="form__label">
                    Mã ca thi:
                  </label>
                  <input
                    id="id"
                    type="text"
                    className="form__input"
                    {...register("id", {
                      required: "Mã ca thi là bắt buộc",
                    })}
                    defaultValue={isEditing ? editSession?.id : ""}
                    disabled={isEditing}
                  />
                  <div className="form__error">
                    {errors.id && <span>{errors.id.message}</span>}
                  </div>
                </div>
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
                  />
                  <div className="form__error">
                    {errors.name && <span>{errors.name.message}</span>}
                  </div>
                </div>
                <div className="form__group">
                  <label htmlFor="startTime" className="form__label">
                    Thời gian bắt đầu:
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form__input"
                    placeholder="HH:MM:SS"
                    {...register("timeStart", {
                      required: "Thời gian bắt đầu là bắt buộc",
                    })}
                  />
                  <div className="form__error">
                    {errors.timeStart && (<span>{errors.timeStart.message}</span>)}
                  </div>
                </div>
                <div className="form__group">
                  <label htmlFor="endTime" className="form__label">
                    Thời gian kết thúc:
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form__input"
                    placeholder="HH:MM:SS"
                    {...register("timeEnd", {
                      required: "Thời gian kết thúc là bắt buộc",
                    })}
                  />
                  <div className="form__error">
                    {errors.timeEnd && <span>{errors.timeEnd.message}</span>}
                  </div>
                </div>
                <div className="form__group" style={{ alignItems: "end" }}>
                  <Button type="submit" className="btn" style={{ width: "auto", color: "white" }}>
                    {isEditing ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Notification
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
    </div>
  );
};

export default ManageExamSessions;
