/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Subject.scss";
import Slideshow from "@components/Slideshow/Slideshow";
import { Button, CVO, GridItem } from "@/components";
import {
  getExamWithSubject,
  getExamWSubjectClient,
} from "@/services/repositories/SemesterServices/SemesterServices";
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

        const response = await getExamWSubjectClient(data.id_exam, data.idcode);
        console.log(response);

        if (response.success === false) {
          setError(response.message || "Lỗi không xác định");
        } else {
          const formattedData = response.data.flatMap((exam: any) => {
            const now = new Date().getTime();

            const startTime = new Date(
              exam.time_start || exam.exam_date
            ).getTime();
            const endTime = new Date(exam.time_end || exam.exam_end).getTime();

            const percentage =
              now >= startTime && now <= endTime
                ? ((now - startTime) / (endTime - startTime)) * 100
                : now > endTime
                ? 100
                : 0;

            return [
              {
                examId: exam.id,
                examName: exam.name,
                startDate: exam.time_start || exam.exam_date,
                endDate: exam.time_end || exam.exam_end,
                examDate: exam.exam_date,
                subjectCountInExam: exam.exam_subjects?.length || 0,
                percentage: parseFloat(percentage.toFixed(2)),
              },
            ];
          });
          setExams(formattedData);
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

  const navToExamById = (id_subject: string) => {
    navigate(`/client/exam`, { state: { id_subject } });
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
              <GridItem key={exam.subjectCode} className="group__itemm">
                <p>
                  Tên Môn thi:{" "}
                  <span className="item__span">{exam.examName}</span>
                </p>
                <p>
                  Mã Môn thi: <span className="item__span">{exam.examId}</span>
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
                <Button
                  onClick={() => navToExamById(exam.examId)}
                  disabled={exam.percentage === 0 || exam.percentage === 100}
                >
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
