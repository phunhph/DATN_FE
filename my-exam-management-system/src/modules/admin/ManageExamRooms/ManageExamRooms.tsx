import { Notification, PageTitle } from "@components/index";
import AsyncSelect from "react-select/async";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Table } from "@components/index";
import "./ManageExamRooms.scss";
import { ExamSubject } from "@/interfaces/SubjectInterface/ExamSubjectInterface";
import { Session } from "inspector/promises";
import { ExamRoom } from "@/interfaces/ExamRoomInterfaces/ExamRoomInterfaces";
import { SemesterType } from "../ManageSemester/Semester.type";
import { getAllSemester } from "@/services/repositories/SemesterServices/SemesterServices";
import { getAllExamSubjectByIdSemester } from "@/services/repositories/ExamSubjectService/ExamSubjectService";
import { Semester } from "@/interfaces/SemesterInterface/SemestertInterface";
import { getExamRoomDetail } from "@/services/repositories/ExamRoomService/ExamRoomService";
import { getAllSession } from "@/services/repositories/SessionService/SessionService";

const ManageExamRooms = () => {
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [semesters, setSemesters] = useState<SemesterType[]>([]);
  const [examSubjects, setExamSubject] = useState<ExamSubject[]>([]);
  const [sessionList, setSessionList] = useState<Session[]>([]);
  const [roomList, setRoomList] = useState<ExamRoom[]>([]);

  const title = ["Tên phòng thi", "Số lượng sinh viên", "Thao tác"];

  const examOptions = semesters.map((semester) => ({
    label: semester.semesterName,
    value: semester.semesterCode,
  }));
  const firstOption = examOptions[0];

  const loadSemesterOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    setTimeout(() => {
      callback(
        examOptions.filter((i) =>
          i.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }, 1000);
  };

  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);
  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const loadSubjectOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    setTimeout(() => {
      callback(
        examSubjects.filter((i) =>
          i.name.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }, 1000);
  };

 const loadSessionOptions = (
   inputValue: string,
   callback: (options: any[]) => void
 ) => {
   setTimeout(() => {
     callback(
       sessionList
         .filter((i) => i.name.toLowerCase().includes(inputValue.toLowerCase()))
         .map((session) => ({
           label: session.name, 
           value: session.id, 
         }))
     );
   }, 1000);
 };

  const getSemester = async () => {
    const data = await getAllSemester();
    if (data.success) {
      const listSemester = formatData(data.data);
      setSemesters(listSemester);
    } else {
      addNotification(data.message ?? "Đã có lỗi xảy ra", data.success);
    }
  };

  const formatData = (data: Semester[] | Semester) => {
    if (Array.isArray(data)) {
      return data.map((e) => ({
        semesterName: e.name,
        semesterCode: e.id,
        semesterStart: e.time_start,
        semesterEnd: e.time_end,
        semesterStatus: e.status,
      }));
    } else if (data && typeof data === "object") {
      return [
        {
          semesterName: data.name,
          semesterCode: data.id,
          semesterStart: data.time_start,
          semesterEnd: data.time_end,
          semesterStatus: data.status,
        },
      ];
    }

    return [];
  };

  const getSubjectsByIdSemester = async (id: string) => {
    const dataSubject = await getAllExamSubjectByIdSemester(id);
    if (dataSubject.success) {
      const formattedSubjects = formatDataSubject(dataSubject.data);
      setExamSubject(formattedSubjects);

      if (formattedSubjects.length > 0) {
        setSelectedSubject(formattedSubjects[0]);
      }
    } else {
      setExamSubject([]);
    }
  };
  const handleSemesterChange = (value: any) => {
    const semesterId = value?.value;
    if (!semesterId) return;
    setSelectedExamId(semesterId);
    getSubjectsByIdSemester(semesterId);
  };

  const formatDataSubject = (data: ExamSubject[] | ExamSubject) => {
    if (Array.isArray(data)) {
      return data.map((e) => ({
        label: e.name,
        value: e.id,
        status: e.status,
      }));
    } else if (data && typeof data === "object") {
      return [
        {
          label: data.name,
          value: data.id,
          status: data.status,
        },
      ];
    }
    return [];
  };

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

  const handleSubjectChange = (value: any) => {
    setValue("subject", value);
    handleSubmit(onSubmit)();
   
  };
  const { handleSubmit, setValue } = useForm();
  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
  };

  const getRoomList = async () => {
    const data = await getExamRoomDetail(selectedExamId);
    setRoomList(data);
  };

  useEffect(() => {
    if (firstOption && !selectedExamId) {
      setSelectedExamId(firstOption.value);
      getSubjectsByIdSemester(firstOption.value);
    }
  }, [firstOption]);

  const onLoad = () => {
    getSemester();
  };

  useEffect(() => {
    onLoad();
  }, []);



  return (
    <>
      <div className="examRooms__container">
        <PageTitle theme="light">Quản lý phòng thi</PageTitle>
        <div className="examRooms__filter">
          <form className="examRooms__filter-form">
            <div className="examRooms__container-child">
              <p className="examRooms__container-title">Kỳ thi</p>
              <AsyncSelect
                cacheOptions
                loadOptions={loadSemesterOptions}
                defaultOptions={examOptions}
                value={examOptions.find(
                  (option) => option.value === selectedExamId
                )}
                onChange={handleSemesterChange}
              />
            </div>
            <div className="examRooms__container-child">
              <p className="examRooms__container-title">Môn thi</p>
              <AsyncSelect
                cacheOptions
                loadOptions={loadSubjectOptions}
                defaultOptions={examSubjects}
                onChange={handleSubjectChange}
              />
            </div>
            <div className="examRooms__container-child">
              <p className="examRooms__container-title">Ca thi</p>
              <AsyncSelect
                cacheOptions
                loadOptions={loadSessionOptions}
                defaultOptions={sessionList.map((session) => ({
                  label: session.name, 
                  value: session.id, 
                }))}
                onChange={(value) => {
                  setValue("session", value);
                  handleSubmit(onSubmit)();
                }}
              />
            </div>
          </form>
        </div>
        {roomList && roomList.length > 0 && (
          <Table title={title} data={roomList} tableName="Phòng thi" />
        )}

        {/* <Notification
          notifications={notifications}
          clearNotifications={clearNotifications}
        /> */}
      </div>
    </>
  );
};

export default ManageExamRooms;
