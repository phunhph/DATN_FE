/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CVO, GridItem } from "@components/index";
import Slideshow from "@components/Slideshow/Slideshow";
import { useClientAuth } from "@/hooks";
import "./Home.scss";
import { getExamWithSubject } from "@/services/repositories/SemesterServices/SemesterServices";
import { ExamWithSubject } from "@/interfaces/SemesterInterface/SemestertInterface";

const Home = () => {
  useClientAuth();
  const [examData, setExamData] = useState<ExamWithSubject[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const goToSubject = () => {
    navigate("/client/subject");
  };

  useEffect(() => {
    const fetchExams = async () => {
      setIsLoading(true);
      try {
        const data = JSON.parse(localStorage.getItem("clientData") ?? '');

        const response = await getExamWithSubject(data.id_exam);
        
        if (response.success === false) {
          setError(response.message || "Lỗi không xác định");
        } else {
          const formattedData = response.data.map((exam: any) => ({
            examName: exam.name,
            examId: exam.id,
            startDate: exam.time_start,
            endDate: exam.time_end,
            subjectCountInExam: exam.exam_subjects?.length || 0,
            percentage: exam.status === 1 ? 100 : 0,
          }));

          setExamData(formattedData);
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

  return (
    <div className="Home__Client">
      <div className="Home__image">
        <Slideshow />
      </div>
      <div className="Home__group">
        <h2>Kỳ thi</h2>
        <div className="group__contentt">
          {isLoading ? (
            <p>Đang tải dữ liệu...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : examData.length === 0 ? (
            <p>Không có kỳ thi nào được tìm thấy.</p>
          ) : (
            examData.map((exam, index) => (
              <GridItem className="group__itemm" key={exam.examId || index}>
                <p>
                  Tên kỳ thi:{" "}
                  <span className="item__span">{exam.examName}</span>
                </p>
                <p>
                  Mã kỳ thi:
                  <span className="item__span">{exam.examId}</span>
                </p>
                <p>Thời gian bắt đầu:</p>
                <span className="item__span">{exam.startDate}</span>
                <p>Thời gian kết thúc:</p>
                <span className="item__span">{exam.endDate}</span>
                <p>
                  Số lượng môn thi:
                  <span className="item__span">{exam.subjectCountInExam}</span>
                </p>
                <CVO percentage={exam.percentage || 0} />
                <Button onClick={goToSubject}>Vào kỳ thi</Button>
              </GridItem>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
