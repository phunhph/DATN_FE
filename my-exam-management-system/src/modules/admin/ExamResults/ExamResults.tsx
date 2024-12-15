import ChildContainer from "@components/ChildContainer/ChildContainer";
import ContainerTitle from "@components/ContainerTitle/ContainerTitle";
import { PageTitle, Table } from "@components/index";
import AsyncSelect from "react-select/async";
import "@scss/theme.scss";
import "./ExamResults.scss";
import { useEffect, useState, useCallback } from "react";
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
  const [selectedSemester, setSelectedSemester] = useState<SelectOption | null>(null);
  const [selectedExamRoom, setSelectedExamRoom] = useState<SelectOption | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<SelectOption | null>(null);
  const [studentScores, setStudentScores] = useState<Point[]>([]);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  let date_step:SelectOption = null;
  const loadSemester = useCallback(async () => {
    try {
      const response = await getAllExams();
      if (response.success && response.data) {
        const formattedOptions = response.data.map((exam) => ({
          value: exam.id,
          label: exam.name,
        }));
        setSemesterList(formattedOptions);

        const defaultSemester = formattedOptions[formattedOptions.length - 1];
        setSelectedSemester(defaultSemester);
        date_step = defaultSemester
        if (defaultSemester?.value) {
          await loadExamRooms(defaultSemester.value);
        }
      }
    } catch (error) {
      console.error("Error loading semesters:", error);
    }
  }, []);

  const loadExamRooms = useCallback(async (examId: string) => {
    try {
      const response = await getExamRoomsByExam(examId);
      if (response.success && response.data) {
        const formattedOptions = response.data.map((room) => ({
          value: room.id,
          label: room.name,
        }));
        setExamRoomList(formattedOptions);

        const defaultExamRoom = formattedOptions[formattedOptions.length - 1];
        setSelectedExamRoom(defaultExamRoom);

        if (defaultExamRoom?.value) {
          await loadStudents(defaultExamRoom.value);
        }
      }
    } catch (error) {
      console.error("Error loading exam rooms:", error);
    }
  }, []);

  const loadStudents = useCallback(async (roomId: string) => {
    try {
      const response = await getCandidatesInRoom(roomId);
      if (response.success && response.data) {
        const formattedOptions = response.data.map((student) => ({
          value: student.idcode,
          label: student.name,
        }));
        setStudentList(formattedOptions);

        const defaultStudent = formattedOptions[0];
        setSelectedStudent(defaultStudent);
        
        if (defaultStudent?.value && selectedSemester?.value) {
          await loadStudentScores(defaultStudent.value, selectedSemester.value);
        } else if (date_step?.value) {
          await loadStudentScores(defaultStudent.value, date_step.value);
        }
      }
    } catch (error) {
      console.error("Error loading students:", error);
    }
  }, [selectedSemester]);

  const loadStudentScores = useCallback(async (studentId: string, examId: string) => {
    try {
      const response = await getStudentPointsByExam(studentId, examId);
      if (response.success && response.data) {
        setStudentScores(response.data.points);
        setAverageScore(response.data.average_point);
      }
    } catch (error) {
      console.error("Error loading student scores:", error);
    }
  }, []);

  useEffect(() => {
    loadSemester();
  }, [loadSemester]);

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
              defaultOptions={semesterList}
              value={selectedSemester}
              onChange={(value) => {
                setSelectedSemester(value);
                if (value?.value) {
                  loadExamRooms(value.value);
                }
              }}
              placeholder="Chọn kỳ thi..."
              noOptionsMessage={() => "Không có dữ liệu"}
            />
          </div>
          <div>
            <ContainerTitle theme="light">Phòng thi</ContainerTitle>
            <AsyncSelect<SelectOption>
              cacheOptions
              defaultOptions={examRoomList}
              value={selectedExamRoom}
              onChange={(value) => {
                setSelectedExamRoom(value);
                if (value?.value) {
                  loadStudents(value.value);
                }
              }}
              placeholder="Chọn phòng thi..."
              noOptionsMessage={() => "Không có dữ liệu"}
            />
          </div>
          <div>
            <ContainerTitle theme="light">Thí sinh</ContainerTitle>
            <AsyncSelect<SelectOption>
              cacheOptions
              defaultOptions={studentList}
              value={selectedStudent}
              onChange={(value) => {
                setSelectedStudent(value);
                if (value?.value && selectedSemester?.value) {
                  loadStudentScores(value.value, selectedSemester.value);
                }
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
            date: score.exam_date
              ? new Date(score.exam_date).toLocaleDateString("vi-VN")
              : "Bỏ thi",
          }))}
          tableName="Bảng điểm thí sinh"
          action_dowload={{
            name: "Tải xuống",
            onClick: () => {
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
              link.setAttribute("download", `\u0111i\u1ec3m_sinh_vi\u00ean_${new Date().toISOString()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            },
          }}
        />
      )}
    </>
  );
};

export default ExamResults;
