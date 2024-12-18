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
  const [hasIncompleteExam, setHasIncompleteExam] = useState(false);

  const navigate = useNavigate();

  const getAuthToken = () => {
    const tokenData = localStorage.getItem("token_client");
    return tokenData ? JSON.parse(tokenData).token : null;
  };

  const checkExamStatus = async () => {
    const user = JSON.parse(localStorage.getItem("clientData") || "");
    const hasIncompleteExam = JSON.parse(
      localStorage.getItem("hasIncompleteExam")!);
    try {
      const response = await fetch(
        `https://wd113.websp.online/api/public/api/candidate/${user.idcode}/check-status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);

      if (data.has_incomplete_exam) {
        setHasIncompleteExam(true);
        if (hasIncompleteExam !== "true") {
          if (confirm("Bạn có muốn tiếp tục?")) {
            const id_subject = data.subject_id
            navigate(`/client/exam`, { state: { id_subject } });
            localStorage.setItem("hasIncompleteExam", "true");
          } else {
            localStorage.removeItem("hasIncompleteExam");
          }
        }
      } else {
        localStorage.setItem("hasIncompleteExam", "false");
      }
    } catch (error) {
      console.error("Error checking exam status:", error);
    }
  };

  const goToSubject = () => {
    navigate("/client/subject");
  };
  const fetchExams = async () => {
    setIsLoading(true);
    try {
      const data = JSON.parse(localStorage.getItem("clientData") || "");

      const response = await getExamWithSubject(data.id_exam);

      if (response.success === false) {
        setError(response.message || "Lỗi không xác định");
      } else {
        const formattedData = response.data.map((exam: any) => {
          const now = new Date().getTime();
          const startTime = new Date(exam.time_start).getTime();
          const endTime = new Date(exam.time_end).getTime();

          const percentage =
            now >= startTime && now <= endTime
              ? ((now - startTime) / (endTime - startTime)) * 100
              : now > endTime
                ? 100
                : 0;

          return {
            examName: exam.name,
            examId: exam.id,
            startDate: exam.time_start,
            endDate: exam.time_end,
            subjectCountInExam: exam.exam_subjects?.length || 0,
            percentage: parseFloat(percentage.toFixed(2)),
          };
        });

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
  useEffect(() => {
    fetchExams();
    if (!hasIncompleteExam) {
      checkExamStatus();
    }
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
            <p className="home-error">{error}</p>
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
                <span className="item__span">
                  {exam.startDate ? new Date(exam.startDate).toLocaleDateString() : "Chưa có thời gian"}
                </span>
                <p>Thời gian kết thúc:</p>
                <span className="item__span">
                  {exam.endDate ? new Date(exam.endDate).toLocaleDateString() : "Chưa có thời gian"}
                </span>
                <p>
                  Số lượng môn thi:
                  <span className="item__span">{exam.subjectCountInExam}</span>
                </p>
                <CVO percentage={exam.percentage || 0} />
                <Button
                  onClick={goToSubject}
                  disabled={
                    !exam.startDate ||
                    !exam.endDate ||
                    new Date().getTime() < new Date(exam.startDate).getTime() ||
                    new Date().getTime() > new Date(exam.endDate).getTime()
                  }
                  style={{
                    backgroundColor:
                      !exam.startDate ||
                        !exam.endDate ||
                        new Date().getTime() < new Date(exam.startDate).getTime() ||
                        new Date().getTime() > new Date(exam.endDate).getTime()
                        ? "#cccccc" // Disabled background color
                        : "" // Default or enabled background color
                  }}
                >
                  Vào kỳ thi
                </Button>
              </GridItem>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
