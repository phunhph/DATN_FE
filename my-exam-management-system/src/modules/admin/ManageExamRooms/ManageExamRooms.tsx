/* eslint-disable @typescript-eslint/no-explicit-any */
import { Notification, PageTitle } from "@components/index";
import AsyncSelect from "react-select/async";
import { useEffect, useState } from "react";
import { Table } from "@components/index";
import "./ManageExamRooms.scss";
import { ExamRoom } from "@/interfaces/ExamRoomInterfaces/ExamRoomInterfaces";
import { SemesterType } from "../ManageSemester/Semester.type";
import { getAllSemester } from "@/services/repositories/SemesterServices/SemesterServices";
import { Semester } from "@/interfaces/SemesterInterface/SemestertInterface";
import { getExamRoom } from "@/services/repositories/ExamRoomService/ExamRoomService";
import { useNavigate } from "react-router-dom";

const ManageExamRooms = () => {
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [semesters, setSemesters] = useState<SemesterType[]>([]);
  const [roomList, setRoomList] = useState<ExamRoom[]>([]);

  const title = ["Mã phòng thi","Tên phòng thi", "Số lượng sinh viên", "Thao tác"];

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

  const handleSemesterChange = (value: any) => {
    const semesterId = value?.value;
    if (!semesterId) return;
    setSelectedExamId(semesterId);
    getRoomList();
  };

  const getRoomList = async () => {
    const data = await getExamRoom(selectedExamId);
    console.log(data.data);
  
    setRoomList(data.data);
  };

  useEffect(() => {
    if (firstOption && !selectedExamId) {
      setSelectedExamId(firstOption.value);
    }
  }, [firstOption]);

  const onLoad = () => {
    getSemester();
  };
  const navigate = useNavigate();
  const handleDetailClick = (id: number | string) => {
    console.log(id);
    
    const room = roomList.find((e) => e.id === id);
    
    if (room) {
      navigate(`/admin/detail-exam-rooms`, { state: { room } });
    } else {
      addNotification("Room not found", false);
    }
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
          </form>
        </div>
        {roomList && roomList.length > 0 && (
          <Table title={title} data={roomList} actions_detail={{
            name: "Chi tiết",
            onClick: (room) => {
              if (room) {
                handleDetailClick(room);
              }
            },
          }}  tableName="Phòng thi" />
        )}

         <Notification
          notifications={notifications}
          clearNotifications={clearNotifications}
        /> 
      </div>
    </>
  );
};

export default ManageExamRooms;
