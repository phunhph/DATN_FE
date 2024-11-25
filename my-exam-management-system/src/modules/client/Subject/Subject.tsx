/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Subject.scss";
import Slideshow from "@components/Slideshow/Slideshow";
import { Button, CVO, GridItem } from "@/components";
import { getExamWithSubject } from "@/services/repositories/SemesterServices/SemesterServices";
import { ExamWithSubject } from "@/interfaces/SemesterInterface/SemestertInterface";

const Subject = () => {
  const [exams, setExams] = useState<ExamWithSubject[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      setIsLoading(true);
      try {
        const data = JSON.parse(localStorage.getItem("clientData") ?? "");

        const response = await getExamWithSubject(data.id_exam);

        if (response.success === false) {
          setError(response.message || "Lỗi không xác định");
        } else {
          const formattedData = response.data.flatMap((exam: any) => {
            
            return exam.exam_subjects.map((subject: any) => ({
              examId: exam.id,
              examName: exam.name,
              subjectName: subject?.name || "Chưa có tên môn thi",
              subjectCode: subject?.id || "Chưa có mã môn thi",
              questionCount: subject?.questions?.length || 0,
              startDate: exam.time_start,
              endDate: exam.time_end,
              subjectCountInExam: exam.exam_subjects.length,
            }));
          });

          setExams(formattedData);
          console.log("Formatted Data:", formattedData);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setError("Không thể tải dữ liệu kỳ thi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);

  const navToExamById = (id: string) => {
    navigate(`/client/exam`,{state: {id}});
  };

  return (
    <div className="Subject__Client">
      <div className="Subject__image">
        <Slideshow />
      </div>

      <div className="Subject__group">
        <h2>Môn thi</h2>
        <div className="group__contentt">
          {isLoading ? (
            <p>Đang tải dữ liệu...</p>
          ) : error ? (
            <p>{error}</p>
          ) : exams.length > 0 ? (
            exams.map((exam) => (
              <GridItem key={exam.examId} className="group__itemm">
                <p>
                  Tên Môn thi:{" "}
                  <span className="item__span">{exam.subjectName}</span>
                </p>
                <p>
                  Mã Môn thi:{" "}
                  <span className="item__span">{exam.subjectCode}</span>
                </p>
                {/* <p>
                  Số câu hỏi:{" "}
                  <span className="item__span">{exam.questionCount}</span>
                </p> */}
                <p>Thời gian bắt đầu:</p>
                <span className="item__span">
                  {new Date(exam.startDate).toLocaleDateString()}
                </span>
                <p>Thời gian kết thúc:</p>
                <span className="item__span">
                  {new Date(exam.endDate).toLocaleDateString()}
                </span>
                <CVO percentage={exam.subjectCountInExam > 0 ? 100 : 0}></CVO>
                <Button onClick={() => navToExamById(exam.subjectCode)}>
                  Làm bài thi
                </Button>
              </GridItem>
            ))
          ) : (
            <p>No exams available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subject;
