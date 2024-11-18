import { Button, Notification, PageTitle, Table } from "@/components";
import { SessionCreate } from "@/interfaces/SessionInterface/SessionInterface";
import {
  addSession,
  getAllSession,
  updateSession,
} from "@/services/repositories/SessionService/SessionService";
import { SessionType } from "./ManageExamSessions.type";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

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
    .filter(
      (item: any) => item.id && item.name && item.time_start && item.time_end
    )
    .map((item: any) => ({
      id: item.id,
      name: item.name,
      timeStart: item.time_start,
      timeEnd: item.time_end,
      status: item.status,
    }))
    .sort((a:any, b:any) => a.name.localeCompare(b.name));

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await getAllSession();
      if (
        response.success &&
        response.data &&
        Array.isArray(response.data)
      ) {
        setSessionList(response.data);
      } else {
        console.error("Invalid data format received from the API");
      }
    };
    fetchSessions();
  }, []);

  const emptyFormValue: SessionType = {
    id: "", 
    name: "",
    time_start: "",
    time_end: "",
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
    if (confirm("Are you sure you want to change the status?")) {
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
      time_start: formData.time_start,
      time_end: formData.time_end,
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

    if (!editSession?.id) {
      addNotification("Không tìm thấy ID của ca thi để cập nhật.", false);
      return;
    }

    const updatedSession: SessionCreate = {
      id: editSession.id,
      name: formData.name,
      time_start: formData.time_start,
      time_end: formData.time_end,
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
    setValue("id", session.id); 
    setValue("name", session.name);
    setValue("time_start", session.time_start);
    setValue("time_end", session.time_end);
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


  // TEST DATA TEST PAGI TEST TABLE
  const sampleData: any[] = [
    {
      id: "1",
      sessionName: "Ca thi Sáng 1",
      date: "2024-11-20",
      startTime: "08:00 AM",
      endTime: "10:00 AM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Toán học",
    },
    {
      id: "2",
      sessionName: "Ca thi Chiều 1",
      date: "2024-11-20",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Văn học",
    },
    {
      id: "3",
      sessionName: "Ca thi Tối 1",
      date: "2024-11-21",
      startTime: "06:00 PM",
      endTime: "08:00 PM",
      status: "Completed",
      additionalInfo: "Kỳ thi Tiếng Anh",
    },
    {
      id: "4",
      sessionName: "Ca thi Sáng 2",
      date: "2024-11-22",
      startTime: "08:00 AM",
      endTime: "10:00 AM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Lịch sử",
    },
    {
      id: "5",
      sessionName: "Ca thi Chiều 2",
      date: "2024-11-22",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Địa lý",
    },
    {
      id: "6",
      sessionName: "Ca thi Tối 2",
      date: "2024-11-23",
      startTime: "06:00 PM",
      endTime: "08:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Sinh học",
    },
    {
      id: "7",
      sessionName: "Ca thi Sáng 3",
      date: "2024-11-24",
      startTime: "08:00 AM",
      endTime: "10:00 AM",
      status: "Completed",
      additionalInfo: "Kỳ thi Hóa học",
    },
    {
      id: "8",
      sessionName: "Ca thi Chiều 3",
      date: "2024-11-24",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Vật lý",
    },
    {
      id: "9",
      sessionName: "Ca thi Tối 3",
      date: "2024-11-25",
      startTime: "06:00 PM",
      endTime: "08:00 PM",
      status: "Completed",
      additionalInfo: "Kỳ thi Công nghệ",
    },
    {
      id: "10",
      sessionName: "Ca thi Sáng 4",
      date: "2024-11-26",
      startTime: "08:00 AM",
      endTime: "10:00 AM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Kinh tế",
    },
    {
      id: "11",
      sessionName: "Ca thi Chiều 4",
      date: "2024-11-26",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Xã hội học",
    },
    {
      id: "12",
      sessionName: "Ca thi Tối 4",
      date: "2024-11-27",
      startTime: "06:00 PM",
      endTime: "08:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Chính trị",
    },
    {
      id: "13",
      sessionName: "Ca thi Sáng 5",
      date: "2024-11-28",
      startTime: "08:00 AM",
      endTime: "10:00 AM",
      status: "Completed",
      additionalInfo: "Kỳ thi Nghệ thuật",
    },
    {
      id: "14",
      sessionName: "Ca thi Chiều 5",
      date: "2024-11-28",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Âm nhạc",
    },
    {
      id: "15",
      sessionName: "Ca thi Tối 5",
      date: "2024-11-29",
      startTime: "06:00 PM",
      endTime: "08:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Giáo dục thể chất",
    },
    {
      id: "16",
      sessionName: "Ca thi Sáng 6",
      date: "2024-11-30",
      startTime: "08:00 AM",
      endTime: "10:00 AM",
      status: "Completed",
      additionalInfo: "Kỳ thi Lý luận",
    },
    {
      id: "17",
      sessionName: "Ca thi Chiều 6",
      date: "2024-11-30",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Triết học",
    },
    {
      id: "18",
      sessionName: "Ca thi Tối 6",
      date: "2024-12-01",
      startTime: "06:00 PM",
      endTime: "08:00 PM",
      status: "Completed",
      additionalInfo: "Kỳ thi Ngôn ngữ",
    },
    {
      id: "19",
      sessionName: "Ca thi Sáng 7",
      date: "2024-12-02",
      startTime: "08:00 AM",
      endTime: "10:00 AM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Lập trình",
    },
    {
      id: "20",
      sessionName: "Ca thi Chiều 7",
      date: "2024-12-02",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Cơ khí",
    },
    {
      id: "21",
      sessionName: "Ca thi Tối 7",
      date: "2024-12-03",
      startTime: "06:00 PM",
      endTime: "08:00 PM",
      status: "Completed",
      additionalInfo: "Kỳ thi Điện tử",
    },
    {
      id: "22",
      sessionName: "Ca thi Sáng 8",
      date: "2024-12-04",
      startTime: "08:00 AM",
      endTime: "10:00 AM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Thiết kế",
    },
    {
      id: "23",
      sessionName: "Ca thi Chiều 8",
      date: "2024-12-04",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Kế toán",
    },
    {
      id: "24",
      sessionName: "Ca thi Tối 8",
      date: "2024-12-05",
      startTime: "06:00 PM",
      endTime: "08:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Marketing",
    },
    {
      id: "25",
      sessionName: "Ca thi Sáng 9",
      date: "2024-12-06",
      startTime: "08:00 AM",
      endTime: "10:00 AM",
      status: "Completed",
      additionalInfo: "Kỳ thi Nông nghiệp",
    },
    {
      id: "26",
      sessionName: "Ca thi Sáng 7",
      date: "2024-12-02",
      startTime: "08:00 AM",
      endTime: "10:00 AM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Lập trình",
    },
    {
      id: "27",
      sessionName: "Ca thi Chiều 7",
      date: "2024-12-02",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Cơ khí",
    },
    {
      id: "28",
      sessionName: "Ca thi Tối 7",
      date: "2024-12-03",
      startTime: "06:00 PM",
      endTime: "08:00 PM",
      status: "Completed",
      additionalInfo: "Kỳ thi Điện tử",
    },
    {
      id: "29",
      sessionName: "Ca thi Sáng 8",
      date: "2024-12-04",
      startTime: "08:00 AM",
      endTime: "10:00 AM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Thiết kế",
    },
    {
      id: "30",
      sessionName: "Ca thi Chiều 8",
      date: "2024-12-04",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Kế toán",
    },
    {
      id: "31",
      sessionName: "Ca thi Tối 8",
      date: "2024-12-05",
      startTime: "06:00 PM",
      endTime: "08:00 PM",
      status: "Scheduled",
      additionalInfo: "Kỳ thi Marketing",
    },
    {
      id: "32",
      sessionName: "Ca thi Sáng 9",
      date: "2024-12-06",
      startTime: "08:00 AM",
      endTime: "10:00 AM",
      status: "Completed",
      additionalInfo: "Kỳ thi Nông nghiệp",
    },
  ];
  
  const testTitle = [   "id",
    "sessionName",
    "date",
    "startTime",
    "endTime",
    "status",
    "additionalInfo"]

  return (
    <div className="examSessions__container">
      <Table 
        title={testTitle}
        tableName="Test Name"
        data={sampleData}
      />

      {/* <PageTitle theme="light">Quản lý ca thi</PageTitle>
      <Table
        title={title}
        data={sortedData}
        tableName="Ca thi"
        actions_add={{ name: "Thêm ca thi", onClick: openAddExamSessionForm }}
        actions_edit={{
          name: "Sửa",
          onClick: (id) => {
            console.log("ID ca thi được chọn:", id);
            // const sessionToEdit = sessionList.find(
            //   (session:any) => session.id === id
            // );
            // console.log("SessionToEdit",sessionToEdit);
            
            if (id) {
              openEditForm(id);
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
                    id="time_start"
                    type="date"
                    className="form__input"
                    {...register("time_start", {
                      required: "Thời gian bắt đầu là bắt buộc",
                    })}
                  />
                  <div className="form__error">
                    {errors.time_start && (
                      <span>{errors.time_start.message}</span>
                    )}
                  </div>
                </div>
                <div className="form__group">
                  <label htmlFor="endTime" className="form__label">
                    Thời gian kết thúc:
                  </label>
                  <input
                    id="time_end"
                    type="date"
                    className="form__input"
                    {...register("time_end", {
                      required: "Thời gian kết thúc là bắt buộc",
                    })}
                  />
                  <div className="form__error">
                    {errors.time_end && <span>{errors.time_end.message}</span>}
                  </div>
                </div>
                <div className="form__group">
                  <Button type="submit" className="btn">
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
      /> */}
    </div>
  );
};

export default ManageExamSessions;
