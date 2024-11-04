import { PageTitle } from "@components/index";
import AsyncSelect from 'react-select/async';
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Table } from "@components/index";
import './ManageExamRooms.scss'
const ManageExamRooms = () => {
  const [semesterList, setSemesterList] = useState<any>([]);
  const [subjectList, setSubjectList] = useState<any>([]);
  const [sessionList, setSessionList] = useState<any>([]);
  const [roomList, setRoomList] = useState<any>([]);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const semesterOptions: any[] = [
    {
      semesterName: "Fall 2024",
      semesterCode: "F2024",
      semesterStart: "2024-09-01",
      semesterEnd: "2024-12-15",
    },
    {
      semesterName: "Spring 2024",
      semesterCode: "S2024",
      semesterStart: "2024-01-10",
      semesterEnd: "2024-05-15",
    },
    {
      semesterName: "Summer 2024",
      semesterCode: "SU2024",
      semesterStart: "2024-06-01",
      semesterEnd: "2024-08-31",
    },
    {
      semesterName: "Winter 2024",
      semesterCode: "W2024",
      semesterStart: "2024-12-16",
      semesterEnd: "2024-01-09",
    },
    {
      semesterName: "Fall 2023",
      semesterCode: "F2023",
      semesterStart: "2023-09-01",
      semesterEnd: "2023-12-15",
    },
    {
      semesterName: "Spring 2023",
      semesterCode: "S2023",
      semesterStart: "2023-01-10",
      semesterEnd: "2023-05-15",
    },
    {
      semesterName: "Summer 2023",
      semesterCode: "SU2023",
      semesterStart: "2023-06-01",
      semesterEnd: "2023-08-31",
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subjectOptions: any[] = [
    { id: 1, subjectName: "Kỳ thi Toán học", subjectType: "mon1", startDate: "2024-09-01", endDate: "2024-09-15", status: "Scheduled" },
    { id: 2, subjectName: "Kỳ thi Vật lý", subjectType: "mon2", startDate: "2024-09-05", endDate: "2024-09-18", status: "Scheduled" },
    { id: 3, subjectName: "Kỳ thi Hóa học", subjectType: "mon3", startDate: "2024-09-10", endDate: "2024-09-20", status: "Scheduled" },
    { id: 4, subjectName: "Kỳ thi Lập trình", subjectType: "mon4", startDate: "2024-09-12", endDate: "2024-09-25", status: "Scheduled" },
    { id: 5, subjectName: "Kỳ thi Văn học", subjectType: "mon5", startDate: "2024-09-08", endDate: "2024-09-22", status: "Scheduled" },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionOptions: any[] = [
    {
      sessionCode: "CT2024-01",
      sessionName: "Ca thi buổi sáng - Toán học",
      trangThai: "Đang diễn ra",
    },
    {
      sessionCode: "CT2024-02",
      sessionName: "Ca thi buổi chiều - Vật lý",
      trangThai: "Chưa bắt đầu",
    },
    {
      sessionCode: "CT2024-03",
      sessionName: "Ca thi buổi tối - Hóa học",
      trangThai: "Đã kết thúc",
    },
    {
      sessionCode: "CT2024-04",
      sessionName: "Ca thi buổi sáng - Lịch sử",
      trangThai: "Chưa bắt đầu",
    },
    {
      sessionCode: "CT2024-05",
      sessionName: "Ca thi buổi chiều - Sinh học",
      trangThai: "Đang diễn ra",
    },
    {
      sessionCode: "CT2024-06",
      sessionName: "Ca thi buổi tối - Địa lý",
      trangThai: "Đã kết thúc",
    },
  ]
  const examRooms = [
    { examRoomName: "Room 101", numberOfStudent: 25 },
    {  examRoomName: "Room 102", numberOfStudent: 30 },
    { examRoomName: "Room 103", numberOfStudent: 20 },
    { examRoomName: "Room 104", numberOfStudent: 28 },
    {  examRoomName: "Room 105", numberOfStudent: 32 },
    {  examRoomName: "Room 106", numberOfStudent: 18 },
    {examRoomName: "Room 107", numberOfStudent: 24 },
    {  examRoomName: "Room 108", numberOfStudent: 22 },
    {  examRoomName: "Room 109", numberOfStudent: 26 },
    {  examRoomName: "Room 110", numberOfStudent: 29 },
  ];

  const title =['Tên phòng thi', 'Số lượng']

  const loadSemester = () => {
    //api semester list
    const formattedSemesterOptions = semesterOptions.map((semester) => ({
      value: semester.semesterCode,
      label: semester.semesterName,
    }));
    setSemesterList(formattedSemesterOptions);
  }

  const loadSubject = (chosedSemesterValue: string) => {
    if ( chosedSemesterValue) {
      //api subject list base on chosedSemesterValue
      const formattedSubjectOpions = subjectOptions.map((subject) => ({
        value: subject.subjectType,
        label: subject.subjectName,
      }));
      setSubjectList(formattedSubjectOpions)
    }
  }

  const loadSession = (chosedSubjectValue: string) => {
    if ( chosedSubjectValue) {
      //api session list base on chosedSubjectValue
      const formattedSessionOpions = sessionOptions.map((session) => ({
        value: session.sessionCode,
        label: session.sessionName,
      }));
      setSessionList(formattedSessionOpions)
    }
  }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadSemesterOptions = (inputValue: string, callback: (options: any[]) => void) => {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback(semesterList.filter((i:any) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
    }, 1000);
  };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadSubjectOptions = (inputValue: string, callback: (options: any[]) => void) => {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback(subjectList.filter((i:any) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
    }, 1000);
  };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadSessionOptions = (inputValue: string, callback: (options: any[]) => void) => {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback(sessionList.filter((i:any) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
    }, 1000);
  };

  const {
    handleSubmit,
    setValue
  } = useForm({})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit:SubmitHandler<any> = (data:any) => {
    console.log(data)
    if (data.semester) {
      loadSubject(data.semester.value)
    }
    if (data.subject) {
      loadSession(data.subject.value)
    }
    if ( data.semester && data.subject && data.session) {
      // api get room list
      console.log(examRooms)
      setRoomList(examRooms)
    }
  }

  useEffect(()=>{
    loadSemester()
  },[])
  
  return (
    <>
      <div className="examRooms__container">
        <PageTitle theme="light">Quản lý phòng thi</PageTitle>
        <div className="examRooms__filter">
          <form className="examRooms__filter-form">
            <div className="examRooms__container-child">
              <p className="examRooms__container-title">Kỳ thi</p>
              <AsyncSelect cacheOptions loadOptions={loadSemesterOptions} defaultOptions={semesterList} onChange={(value) => {
                setValue("semester", value);
                handleSubmit(onSubmit)()
              }}/>
            </div>
            <div className="examRooms__container-child">
              <p className="examRooms__container-title">Môn thi</p>
              <AsyncSelect cacheOptions loadOptions={loadSubjectOptions} defaultOptions={subjectList} onChange={(value) => {
                setValue("subject", value);
                handleSubmit(onSubmit)()
              }}/>
            </div>
            <div className="examRooms__container-child">
              <p className="examRooms__container-title">Ca thi</p>
              <AsyncSelect cacheOptions loadOptions={loadSessionOptions} defaultOptions={sessionList} onChange={(value) => {
                setValue("session", value);
                handleSubmit(onSubmit)()
              }}/>
            </div>
          </form>
        </div>
          { roomList && (
            <Table
            title={title}
              data={roomList}
              tableName="Phòng thi"
            />
          )}
      </div>
    </>
  );
};

export default ManageExamRooms;
