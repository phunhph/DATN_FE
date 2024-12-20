/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Subject.scss";
import Slideshow from "@components/Slideshow/Slideshow";
import { Button, CVO, GridItem, Notification } from "@/components";
import {
  getExamWithSubject,
  getExamWSubjectClient,
} from "@/services/repositories/SemesterServices/SemesterServices";
import { ExamWithSubject } from "@/interfaces/SemesterInterface/SemestertInterface";
import { getScoreboardByIdSubject } from "@/services/repositories/scoreboard/scoreboardServices";

const Subject = () => {
  const [exams, setExams] = useState<ExamWithSubject[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { point } = location.state || {};

  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);

  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const checkPoint = async (id_subject: string) => {
    const user = localStorage.getItem("clientData");
    if (user) {
      const parsedUser = JSON.parse(user);
      const result = await getScoreboardByIdSubject(
        parsedUser.idcode,
        id_subject
      );

      if (result.success) {
        addNotification("Môn thi đã có kết quả", false);
      } else {
        navToExamById(id_subject);
      }
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };
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
            let startTime: number;
            let endTime: number;
            let dateExam: number;
            let percentage: number;

            if (exam.time_start != null) {
              startTime = new Date(exam.time_start).getTime();
              endTime = new Date(exam.time_end).getTime();
              dateExam = new Date(exam.exam_date).getTime();

              if (now < dateExam) {
                percentage = 0;
              } else if (now >= dateExam) {
                percentage = 100;
              } else {
                percentage =
                  now >= startTime && now <= endTime
                    ? ((now - startTime) / (endTime - startTime)) * 100
                    : now > endTime
                    ? 100
                    : 0;
              }
            } else {
              startTime = new Date(exam.exam_date).getTime();
              endTime = new Date(exam.exam_end).getTime();

              percentage =
                now >= startTime && now <= endTime
                  ? ((now - startTime) / (endTime - startTime)) * 100
                  : now > endTime
                  ? 100
                  : 0;
              console.log(percentage);
            }

            return [
              {
                examId: exam.id,
                examName: exam.name,
                startDate: exam.time_start,
                endDate: exam.time_end,
                examDate: exam.exam_date,
                date_end: exam.exam_end,

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
                <div>
                  {exam.startDate && (
                    <>
                      <p>Thời gian bắt đầu:</p>
                      <span className="item__span">{exam.startDate}</span>
                      <p>Thời gian kết thúc:</p>
                      <span className="item__span">{exam.endDate}</span>
                      <p>Ngày thi</p>
                      <span className="item__span">
                        {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : "Chưa có ngày thi"}
                      </span>
                      <CVO percentage={exam.percentage || 0}></CVO>
                    </>
                  )}
                  {!exam.startDate && exam.date_end && (
                    <>
                      <p>Thời gian bắt đầu:</p>
                      <span className="item__span">
                        { exam.examDate ? new Date(exam.examDate).toLocaleDateString() : "Chưa có thời gian"}
                      </span>
                      <p>Thời gian kết thúc:</p>
                      <span className="item__span">
                        { exam.date_end ? new Date(exam.date_end).toLocaleDateString() : "Chưa có thời gian"}
                      </span>
                      <p> &nbsp;</p>
                      <span className="item__span"> &nbsp;</span>
                      <CVO percentage={exam.percentage || 0}></CVO>
                    </>
                  )}
                </div>
                <Button
                  onClick={() => {
                    if (exam.percentage === 0) {
                      addNotification("Chưa tới thời gian thi!", false);
                    } else if (exam.percentage === 100) {
                      addNotification("Đã hết thời gian thi!", false);
                    } else {
                      checkPoint(exam.examId!);
                    }
                  }}
                  disabled={
                    !exam.examDate ||
                    !exam.date_end ||
                    new Date().getTime() < new Date(exam.examDate).getTime() ||
                    new Date().getTime() > new Date(exam.date_end).getTime()
                  }
                  style={{
                    backgroundColor:
                      !exam.examDate ||
                        !exam.date_end ||
                        new Date().getTime() < new Date(exam.examDate).getTime() ||
                        new Date().getTime() > new Date(exam.date_end).getTime()
                        ? "#cccccc" // Disabled background color
                        : "" // Default or enabled background color
                  }}
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
      <Notification
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
    </div>
  );
};

export default Subject;
