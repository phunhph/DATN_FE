import ChildContainer from "@components/ChildContainer/ChildContainer";
import ContainerTitle from "@components/ContainerTitle/ContainerTitle";
import { PageTitle, Table } from "@components/index";
import AsyncSelect from "react-select/async";
import "@scss/theme.scss";
import "./ExamResults.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { applyTheme } from "@/SCSS/applyTheme";
import {
  getAllExams,
  getExamRoomsByExam,
  getCandidatesInRoom,
  getStudentPointsByExam,
} from "@/services/repositories/PointService/PointService";

interface SelectOption {
  value: string;
  label: string;
}

interface FormData {
  semester?: SelectOption;
  examRoom?: SelectOption;
  student?: SelectOption;
}

interface Point {
  subject_name: string;
  point: number;
  correct_answers: number;
  exam_date: string;
}

const ExamResults = () => {
  const [semesterList, setSemesterList] = useState<SelectOption[]>([]);
  const [examRoomList, setExamRoomList] = useState<SelectOption[]>([]);
  const [studentList, setStudentList] = useState<SelectOption[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<SelectOption | null>(
    null
  );
  const [selectedExamRoom, setSelectedExamRoom] = useState<SelectOption | null>(
    null
  );
  const [selectedStudent, setSelectedStudent] = useState<SelectOption | null>(
    null
  );
  const [studentScores, setStudentScores] = useState<Point[]>([]);
  const [averageScore, setAverageScore] = useState<number | null>(null);

  const loadSemester = async (): Promise<void> => {
    try {
      const response = await getAllExams();
      if (response.success && response.data) {
        const formattedOptions = response.data.map((exam) => ({
          value: exam.id,
          label: exam.name,
        }));
        setSemesterList(formattedOptions);
      }
    } catch (error) {
      console.error("Error loading semesters:", error);
    }
  };

  const loadExamRooms = async (examId: string): Promise<void> => {
    try {
      const response = await getExamRoomsByExam(examId);
      if (response.success && response.data) {
        const formattedOptions = response.data.map((room) => ({
          value: room.id,
          label: room.name,
        }));
        setExamRoomList(formattedOptions);
      }
    } catch (error) {
      console.error("Error loading exam rooms:", error);
    }
  };

  const loadStudent = async (roomId: string): Promise<void> => {
    try {
      const response = await getCandidatesInRoom(roomId);
      if (response.success && response.data) {
        const formattedOptions = response.data.map((student) => ({
          value: student.idcode,
          label: student.name,
        }));
        setStudentList(formattedOptions);
      }
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  const loadStudentScores = async (
    studentId: string,
    examId: string
  ): Promise<void> => {
    try {
      const response = await getStudentPointsByExam(studentId, examId);
      if (response.success && response.data) {
        setStudentScores(response.data.points);
        setAverageScore(response.data.average_point);
      }
    } catch (error) {
      console.error("Error loading student scores:", error);
    }
  };

  const loadSemesterOptions = (
    inputValue: string,
    callback: (options: SelectOption[]) => void
  ): void => {
    setTimeout(() => {
      callback(
        semesterList.filter((i) =>
          i.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }, 1000);
  };

  const loadExamRoomOptions = (
    inputValue: string,
    callback: (options: SelectOption[]) => void
  ): void => {
    setTimeout(() => {
      callback(
        examRoomList.filter((i) =>
          i.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }, 1000);
  };

  const loadStudentOptions = (
    inputValue: string,
    callback: (options: SelectOption[]) => void
  ): void => {
    setTimeout(() => {
      callback(
        studentList.filter((i) =>
          i.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }, 1000);
  };

  const downloadSample = (): void => {
    const table = document.querySelector(".custom-table");
    if (!table) return;

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    const rows = table.querySelectorAll("tr");

    rows.forEach((row) => {
      const cells = row.querySelectorAll("th, td");
      const rowContent = Array.from(cells)
        .map((cell) => cell.textContent)
        .join(",");
      csvContent += rowContent + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `điểm_sinh_viên_${new Date().toISOString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { handleSubmit, setValue } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (data.semester?.value !== selectedSemester?.value) {
      setSelectedSemester(data.semester || null);
      setSelectedExamRoom(null);
      setSelectedStudent(null);
      setStudentScores([]);
      setAverageScore(null);
      setExamRoomList([]); // Reset danh sách phòng
      setStudentList([]); // Reset danh sách sinh viên
      if (data.semester?.value) {
        await loadExamRooms(data.semester.value);
      }
    } else if (data.examRoom?.value !== selectedExamRoom?.value) {
      setSelectedExamRoom(data.examRoom || null);
      setSelectedStudent(null);
      setStudentScores([]);
      setAverageScore(null);
      setStudentList([]); // Reset danh sách sinh viên
      if (data.examRoom?.value) {
        await loadStudent(data.examRoom.value);
      }
    } else if (data.student?.value !== selectedStudent?.value) {
      setSelectedStudent(data.student || null);
      if (data.student?.value && selectedSemester?.value) {
        await loadStudentScores(data.student.value, selectedSemester.value);
      }
    }
  };

  useEffect(() => {
    loadSemester();
  }, []);

  applyTheme();

  return (
    <>
      <PageTitle theme="light">Quản lý kết quả thi</PageTitle>
      <ChildContainer theme="light">
        <form className="examResults__filter--group">
          <div>
            <ContainerTitle theme="light">Kỳ thi</ContainerTitle>
            <AsyncSelect<SelectOption>
              cacheOptions
              loadOptions={loadSemesterOptions}
              defaultOptions={semesterList}
              value={selectedSemester}
              onChange={(value) => {
                setValue("semester", value as SelectOption);
                handleSubmit(onSubmit)();
              }}
              components={{
                IndicatorSeparator: () => null,
              }}
              placeholder="Chọn kỳ thi..."
              noOptionsMessage={() => "Không có dữ liệu"}
            />
          </div>
          <div>
            <ContainerTitle theme="light">Phòng thi</ContainerTitle>
            <AsyncSelect<SelectOption>
              cacheOptions
              loadOptions={loadExamRoomOptions}
              defaultOptions={examRoomList}
              value={selectedExamRoom}
              onChange={(value) => {
                setValue("examRoom", value as SelectOption);
                handleSubmit(onSubmit)();
              }}
              components={{
                IndicatorSeparator: () => null,
              }}
              placeholder="Chọn phòng thi..."
              noOptionsMessage={() => "Không có dữ liệu"}
            />
          </div>
          <div>
            <ContainerTitle theme="light">Thí sinh</ContainerTitle>
            <AsyncSelect<SelectOption>
              cacheOptions
              loadOptions={loadStudentOptions}
              defaultOptions={studentList}
              value={selectedStudent}
              onChange={(value) => {
                setValue("student", value as SelectOption);
                handleSubmit(onSubmit)();
              }}
              components={{
                IndicatorSeparator: () => null,
              }}
              placeholder="Chọn thí sinh..."
              noOptionsMessage={() => "Không có dữ liệu"}
            />
          </div>
        </form>
      </ChildContainer>

      {studentScores && studentScores.length > 0 && (
        <Table
          title={["Môn thi", "Điểm", "Số câu đúng", "Ngày thi"]}
          data={studentScores.map((score) => ({
            subject: score.subject_name,
            point: score.point,
            correct: score.correct_answers,
            date: new Date(score.exam_date).toLocaleDateString("vi-VN"),
          }))}
          tableName="Bảng điểm thí sinh"
          action_dowload={{ name: "Tải xuống", onClick: downloadSample }}
        ></Table>
      )}
    </>
  );
};

export default ExamResults;
