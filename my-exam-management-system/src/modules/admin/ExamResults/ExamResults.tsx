import ChildContainer from "@components/ChildContainer/ChildContainer";
import ContainerTitle from "@components/ContainerTitle/ContainerTitle";
import { PageTitle } from "@components/index";
import { Table } from "@components/index";
import AsyncSelect from 'react-select/async';
import "@scss/theme.scss";
import "./ExamResults.scss"
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {applyTheme} from "@/SCSS/applyTheme";

const ExamResults = () => {
    const [semesterList, setSemesterList] = useState<any>([]);
    const [subjectList, setSubjectList] = useState<any>([]);
    const [examRoomList, setExamRoomList] = useState<any>([]);
    const [studentList, setStudentList] = useState<any>([]);
    const [studentScores, setStudentScores] = useState<any>([])
    const [averageScore, setAverageScore] = useState<number | null>(null);

    //mock data
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
    const subjectOptions: any[] = [
        { id: 1, subjectName: "Kỳ thi Toán học", subjectType: "mon1", startDate: "2024-09-01", endDate: "2024-09-15", status: "Scheduled" },
        { id: 2, subjectName: "Kỳ thi Vật lý", subjectType: "mon2", startDate: "2024-09-05", endDate: "2024-09-18", status: "Scheduled" },
        { id: 3, subjectName: "Kỳ thi Hóa học", subjectType: "mon3", startDate: "2024-09-10", endDate: "2024-09-20", status: "Scheduled" },
        { id: 4, subjectName: "Kỳ thi Lập trình", subjectType: "mon4", startDate: "2024-09-12", endDate: "2024-09-25", status: "Scheduled" },
        { id: 5, subjectName: "Kỳ thi Văn học", subjectType: "mon5", startDate: "2024-09-08", endDate: "2024-09-22", status: "Scheduled" },
    ];
    const examRoomOptions = [
        { examRoomID: "R101", examRoomName: "Room 101", numberOfStudent: 25 },
        { examRoomID: "R102", examRoomName: "Room 102", numberOfStudent: 30 },
        { examRoomID: "R103", examRoomName: "Room 103", numberOfStudent: 20 },
        { examRoomID: "R104", examRoomName: "Room 104", numberOfStudent: 28 },
        { examRoomID: "R105", examRoomName: "Room 105", numberOfStudent: 32 },
        { examRoomID: "R106", examRoomName: "Room 106", numberOfStudent: 18 },
        { examRoomID: "R107", examRoomName: "Room 107", numberOfStudent: 24 },
        { examRoomID: "R108", examRoomName: "Room 108", numberOfStudent: 22 },
        { examRoomID: "R109", examRoomName: "Room 109", numberOfStudent: 26 },
        { examRoomID: "R110", examRoomName: "Room 110", numberOfStudent: 29 },
    ];
    const studentOptions = [
        { studentID: 'S001', studentName: 'John Doe' },
        { studentID: 'S002', studentName: 'Jane Smith' },
        { studentID: 'S003', studentName: 'Alex Johnson' },
        { studentID: 'S004', studentName: 'Emily Davis' },
        { studentID: 'S005', studentName: 'Michael Brown' },
        { studentID: 'S006', studentName: 'Sarah Wilson' },
        { studentID: 'S007', studentName: 'David Lee' },
        { studentID: 'S008', studentName: 'Sophia Martinez' },
        { studentID: 'S009', studentName: 'Chris Taylor' },
        { studentID: 'S010', studentName: 'Olivia Harris' },
    ];
    const studentScoreList = [
        { studentID: 'S001', subject: 'Toán', score: 85 },
        { studentID: 'S001', subject: 'Tiếng Anh', score: 90 },
        { studentID: 'S001', subject: 'Lịch sử', score: 88 },
    ];
    const loadSemester = () => {
        //api semester list
        const formattedSemesterOptions = semesterOptions.map((semester) => ({
            value: semester.semesterCode,
            label: semester.semesterName,
        }));
        setSemesterList(formattedSemesterOptions);
    }

    const loadSubject = (chosedSemesterValue: string) => {
        if (chosedSemesterValue) {
            //api subject list base on chosedSemesterValue
            const formattedSubjectOpions = subjectOptions.map((subject) => ({
                value: subject.subjectType,
                label: subject.subjectName,
            }));
            setSubjectList(formattedSubjectOpions)
        }
    }

    const loadExamRooms = (chosedSubjectValue: string) => {
        if (chosedSubjectValue) {
            //api exam room list base on chosedSubjectValue
            const formattedExamRoomOpions = examRoomOptions.map((examRoom) => ({
                value: examRoom.examRoomID,
                label: examRoom.examRoomName,
            }));
            setExamRoomList(formattedExamRoomOpions)
        }
    }

    const loadStudent = (chosedExamRoomValue: string) => {
        if (chosedExamRoomValue) {
            //api student list base on chosedExamRoomValue
            const formattedStudentOptions = studentOptions.map((student) => ({
                value: student.studentID,
                label: student.studentName
            }))
            setStudentList(formattedStudentOptions)
        }
    }

    const loadSemesterOptions = (inputValue: string, callback: (options: any[]) => void) => {
        setTimeout(() => {
            callback(semesterList.filter((i: any) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
        }, 1000);
    };

    const loadSubjectOptions = (inputValue: string, callback: (options: any[]) => void) => {
        setTimeout(() => {
            callback(subjectList.filter((i: any) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
        }, 1000);
    };

    const loadExamRoomtOptions = (inputValue: string, callback: (options: any[]) => void) => {
        setTimeout(() => {
            callback(examRoomList.filter((i: any) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
        }, 1000);
    };

    const loadStudentOptions = (inputValue: string, callback: (options: any[]) => void) => {
        setTimeout(() => {
            callback(studentList.filter((i: any) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
        }, 1000);
    };

    const downloadSample = () => {
        // Chọn bảng từ DOM
        const table = document.querySelector(".custom-table");
        if (!table) return;

        // Trích xuất dữ liệu từ bảng
        let csvContent = "data:text/csv;charset=utf-8";

        const rows = table.querySelectorAll("tr");

        rows.forEach((row) => {
            const cells = row.querySelectorAll("th, td");
            const rowContent = Array.from(cells)
                .map((cell) => cell.textContent)
                .join(",");
            csvContent += rowContent + "\n";
        });

        // Tạo liên kết và tải xuống file CSV
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "table_data.csv");
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
    };

    const {
        handleSubmit,
        setValue
    } = useForm({})

    const onSubmit: SubmitHandler<any> = (data: any) => {
        console.log(data)
        if (data.semester) {
            loadSubject(data.semester.value)
        }
        if (data.subject) {
            loadExamRooms(data.subject.value)
        }
        if (data.examRoom) {
            loadStudent(data.examRoom.value)
        }
        if (data.semester && data.subject && data.examRoom && data.student) {
            // api get room list
            setStudentScores(studentScoreList)
            const totalScore = studentScoreList.reduce((sum, student) => sum + student.score, 0);
            const avgScore = totalScore / studentScoreList.length;
            setAverageScore(avgScore);
        }
    }

    useEffect(() => {
        loadSemester()
    }, [])

    applyTheme()
    return (
        <>
            <PageTitle theme="light">Quản lý kết quả thi</PageTitle>
            <ChildContainer theme="light">
                <form className="examResults__filter--group">
                    <div >
                        <ContainerTitle theme="light">Kỳ thi</ContainerTitle>
                        <AsyncSelect cacheOptions loadOptions={loadSemesterOptions} defaultOptions={semesterList} onChange={(value) => {
                            setValue("semester", value);
                            handleSubmit(onSubmit)()
                        }}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                        />
                    </div>
                    <div >
                        <ContainerTitle theme="light">Môn thi</ContainerTitle>
                        <AsyncSelect cacheOptions loadOptions={loadSubjectOptions} defaultOptions={subjectList} onChange={(value) => {
                            setValue("subject", value);
                            handleSubmit(onSubmit)()
                        }}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                        />
                    </div>
                    <div >
                        <ContainerTitle theme="light">Phòng thi</ContainerTitle>
                        <AsyncSelect cacheOptions loadOptions={loadExamRoomtOptions} defaultOptions={examRoomList} onChange={(value) => {
                            setValue("examRoom", value);
                            handleSubmit(onSubmit)()
                        }}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                        />
                    </div>
                    <div >
                        <ContainerTitle theme="light">Thí sinh</ContainerTitle>
                        <AsyncSelect cacheOptions loadOptions={loadStudentOptions} defaultOptions={studentList} onChange={(value) => {
                            setValue("student", value);
                            handleSubmit(onSubmit)()
                        }}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                        />
                    </div>
                </form>
            </ChildContainer>
            {studentScores && (
                <Table
                    title={["Mã thí sinh", "Môn thi", "Điểm"]}
                    data={studentScores}
                    tableName="Bảng điểm thí sinh"
                    action_dowload={{ name: "Download", onClick: downloadSample }}
                >
                    <div className="examResults__total">
                        <p>Điểm trung bình: {averageScore?.toFixed(2) ?? <span className="examResults__total--not-pass">Không khả dụng</span>}</p>
                        <p>Trạng thái: {averageScore && averageScore > 50 ? <span className="examResults__total--pass">Đạt</span> : <span className="examResults__total--not-pass">Không đạt</span>}</p>
                    </div>
                </Table>
            )}
        </>
    )
}

export default ExamResults