import {
  Button,
  CandidateAvatarName,
  CountdownTimer,
  Notification,
  QuestionAnswerImage,
  QuestionBoard,
} from "@components/index";
import { CandidatesInformation } from "@interfaces/CandidateInfoInterface/CandidateInfoInterface";
import { Question } from "@interfaces/QuestionInterface/QuestionInterface";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Exam.scss";
import { getExamByIdCode } from "@/services/repositories/CandidatesService/CandidatesService";

type Props = {};

const Exam: React.FC<Props> = () => {
    const [timeLeft, setTimeLeft] = useState(3600);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  //Đổi màn loại bài thi
  const [currentView, setCurrentView] = useState<string>("");

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  //mock APi
  const [questions, setQuestions] = useState<Question[]>([]);

  const [readingQuestions, setReadingQuestions] = useState<Question[]>([]);

  const [listeningQuestions, setListeningQuestions] = useState<Question[]>([]);
  const paragraphs: { id: number; text: string }[] = [
    {
      id: 1,
      text: "While eating at a restaurant is an enjoyable and convenient occasional treat, most individuals and families prepare their meals at home. To make breakfast, lunch, and dinner daily, these persons must have the required foods and ingredients on hand and ready to go; foods and ingredients are typically purchased from a grocery store, or an establishment that distributes foods, drinks, household products, and other items that're used by the typical consumer.",
    },
    {
      id: 2,
      text: "Produce, or the term used to describe fresh fruits and vegetables, is commonly purchased by grocery store shoppers. In terms of fruit, most grocery stores offer bananas, apples, oranges, blackberries, raspberries, grapes, pineapples, cantaloupes, watermelons, and more; other grocery stores with larger produce selections might offer the listed fruits in addition to less common fruits, including mangoes, honeydews, starfruits, coconuts, and more.",
    },
    {
      id: 3,
      text: "Depending on the grocery store, customers can purchase fruits in a few different ways. Some stores will charge a set amount per pound of fruit, and will weigh customers' fruit purchases and bill them accordingly; other stores will charge customers for each piece of fruit they buy, or for bundles of fruit (a bag of bananas, a bag of apples, etc.); other stores yet will simply charge by the container.",
    },
    {
      id: 4,
      text: "Vegetables, including lettuce, corn, tomatoes, onions, celery, cucumbers, mushrooms, and more are also sold at many grocery stores, and are purchased similarly to the way that fruits are. Grocery stores typically stock more vegetables than fruit at any given time, as vegetables remain fresh longer than fruits do, generally speaking.",
    },
    {
      id: 5,
      text: "It'd take quite a while to list everything else that today's massive grocery stores sell, but most customers take the opportunity to shop for staples, or foods that play a prominent role in the average diet, at the establishments. Staples include pasta, rice, flour, sugar, milk, meat, and eggs, and bread. All the listed staples are available in prepackaged containers, but can be purchased 'fresh' in some grocery stores, wherein employees will measure and weigh fresh products and then provide them to customers.",
    },
  ];

  //lăn câu hỏi
  const multiChoiceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const readingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listeningRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleQuestionSelect = (questionNumber: number) => {
    const questionIndex = questionNumber - 1;
    if (multiChoiceRefs.current[questionIndex]) {
      multiChoiceRefs.current[questionIndex]?.scrollIntoView({
        behavior: "smooth",
      });
    }
    if (readingRefs.current[questionIndex]) {
      readingRefs.current[questionIndex]?.scrollIntoView({
        behavior: "smooth",
      });
    }
    if (listeningRefs.current[questionIndex]) {
      listeningRefs.current[questionIndex]?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  //Xử lý các câu hỏi đã đc trả lời
  const [selectedMultiChoiceAnswers, setSelectedMultiChoiceAnswers] = useState<{
    [key: number]: number | null;
  }>({});
  const [selectedReadingAnswers, setSelectedReadingAnswers] = useState<{
    [key: number]: number | null;
  }>({});
  const [selectedListeningAnswers, setSelectedListeningAnswers] = useState<{
    [key: number]: number | null;
  }>({});

  const handleAnswerSelect = (questionNumber: number, answerId: number) => {
    console.log(`Câu hỏi trắc nghiệm ${questionNumber}, đã chọn đáp án: ${answerId}`);
    setSelectedMultiChoiceAnswers((prev) => {
      const newSelectedMultiChoiceAnswers = {
        ...prev,
        [questionNumber]: answerId,
      };
      return newSelectedMultiChoiceAnswers;
    });
  };
  const handleReadingAnswerSelect = (
    questionNumber: number,
    answerId: number
  ) => {
    // console.log(`Câu hỏi bài đọc: ${questionNumber}, đã chọn đáp án: ${answerId}`);
    setSelectedReadingAnswers((prev) => {
      const newSelectedReadingAnswers = {
        ...prev,
        [questionNumber]: answerId,
      };
      return newSelectedReadingAnswers;
    });
  };
  const handleListeningAnswerSelect = (
    questionNumber: number,
    answerId: number
  ) => {
    // console.log(`Câu hỏi bài nghe ${questionNumber}, đã chọn đáp án: ${answerId}`);
    setSelectedListeningAnswers((prev) => {
      const newSelectedMultiChoiceAnswers = {
        ...prev,
        [questionNumber]: answerId,
      };
      return newSelectedMultiChoiceAnswers;
    });
  };

  //thông tin thí sinh
  const [candidates] = useState<CandidatesInformation[]>([
    {
      id: 1,
      masv: "PH11111",
      name: "Nguyễn Văn A",
      dob: "2004-12-09",
      address: "Hà Nội",
      email: "anvph11111@gmail.com",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
    },
  ]);

  const candidate = candidates[0];

  //thông bóa
  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);

  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  //audio bài kiểm tra

  const [playPause, setPlayPause] = useState<boolean>(true);
  const [playCount, setPlayCount] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getExam = async (id: string, code: string) => {
    const result = await getExamByIdCode(id, code);
    console.log(result.data.time);
    
    setTimeLeft(result.data.time)
  };

  useEffect(() => {
    const user = localStorage.getItem("clientData");
    if (user) {
      const parsedUser = JSON.parse(user);

      getExam(id, parsedUser.idcode);
    }
    //API lấy file audio/ link audio
    audioRef.current = new Audio(
      "https://www.oxfordonlineenglish.com/wp-content/uploads/2014/02/listening-test-pt-1.mp3?_=1"
    );

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.onended = () => {
        setPlayPause(true);
      };
      audioElement.ontimeupdate = () => {
        if (audioElement.duration > 0) {
          setProgress((audioElement.currentTime / audioElement.duration) * 100);
        }
      };
    }

    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (playPause && playCount < 3) {
        audioRef.current.play();
        setPlayPause(false);
        setPlayCount((prevCount) => prevCount + 1);
      } else if (playCount >= 3) {
        addNotification("Bạn đã hết lượt nghe.", false);
      }
    }
  };

  //Lấy thời gian còn lại

  const handleTimeChange = (newTime: number) => {
    setTimeLeft(newTime);
  };
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Nộp bài
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [handin, setHandin] = useState<boolean>(false);

  const handleHandin = () => {
    // kiểm tra chọn hết câu hỏi trắc nghiệm chưa
    const allMultiChoiceAnswered = questions.every(
      (question) =>
        selectedMultiChoiceAnswers[question.questionNumber] !== undefined
    );
    // kiểm tra chọn hết câu hỏi bài đọc chưa
    const allReadingAnswered = readingQuestions.every(
      (question) =>
        selectedReadingAnswers[question.questionNumber] !== undefined
    );
    // kiểm tra chọn hết câu hỏi bài đọc chưa
    const allListeningAnswered = listeningQuestions.every(
      (question) =>
        selectedListeningAnswers[question.questionNumber] !== undefined
    );

    if (
      !allMultiChoiceAnswered ||
      !allReadingAnswered ||
      !allListeningAnswered
    ) {
      addNotification("Hãy kiểm tra lại và chọn tất cả đáp án.", false);
      return;
    }

    // addNotification('Đã nộp bài thành công.', true);
    console.log("Thời gian làm bài: " + (3600 - timeLeft));
    console.log("Đáp án trắc nghiệm đã chọn: ", selectedMultiChoiceAnswers);
    console.log("Đáp án bài đọc đã chọn: ", selectedReadingAnswers);
    console.log("Đáp án bài nghe đã chọn: ", selectedListeningAnswers);

    setHandin(true);
  };

  const handleSubmit = () => {
    setHandin(false);
    setSubmitted(true);
  };

  useEffect(() => {
    setCurrentView("Trắc nghiệm");
  }, []);

  return (
    <div className="exam__container">
      {!submitted && !handin && (
        <>
          <div className="exam__title">
            <h1>Làm bài thi</h1>
          </div>
          <div className="exam__detail">
            {/* Bài trắc nghiệm */}

            <div
              className={`exam__detail-left ${
                currentView === "Trắc nghiệm" ? "" : "display-none"
              }`}
            >
              {questions.map((question, index) => (
                <div
                  key={question.questionNumber}
                  ref={(el) => (multiChoiceRefs.current[index] = el)}
                >
                  <QuestionAnswerImage
                    question={question}
                    onAnswerSelect={handleAnswerSelect}
                    selectedAnswerIndex={
                      selectedMultiChoiceAnswers[question.questionNumber] ||
                      null
                    }
                  />
                </div>
              ))}
            </div>

            {/* Bài đọc */}

            <div
              className={`exam__detail-left ${
                currentView === "Bài đọc" ? "" : "display-none"
              }`}
            >
              <div className="exam__reading">
                {paragraphs.map((p) => (
                  <p key={p.id}>{p.text}</p>
                ))}
              </div>
              <div className="exam__reading-answer">
                <div>Questions</div>
                <div>Answers</div>
              </div>
              {readingQuestions.map((question, index) => (
                <div
                  key={question.questionNumber}
                  ref={(el) => (readingRefs.current[index] = el)}
                >
                  <QuestionAnswerImage
                    question={question}
                    onAnswerSelect={handleReadingAnswerSelect}
                    selectedAnswerIndex={
                      selectedReadingAnswers[question.questionNumber] || null
                    }
                  />
                </div>
              ))}
            </div>

            {/* Bài nghe */}

            <div
              className={`exam__detail-left ${
                currentView !== "Bài nghe" ? "display-none" : ""
              }`}
            >
              <div className="exam__audio">
                <Button
                  type="button"
                  className="exam__audio-button"
                  onClick={toggleAudio}
                >
                  Phát
                </Button>
                <p>Số lần phát còn lại: {3 - playCount} lần</p>
                <div>
                  <progress
                    className="exam__audio-progress"
                    value={progress}
                    max={100}
                  ></progress>
                  <span>
                    {formatTime(audioRef.current?.currentTime || 0)} /{" "}
                    {formatTime(audioRef.current?.duration || 0)}
                  </span>
                </div>
              </div>
              {listeningQuestions.map((question, index) => (
                <div
                  key={question.questionNumber}
                  ref={(el) => (listeningRefs.current[index] = el)}
                >
                  <QuestionAnswerImage
                    question={question}
                    onAnswerSelect={handleListeningAnswerSelect}
                    selectedAnswerIndex={
                      selectedListeningAnswers[question.questionNumber] || null
                    }
                  />
                </div>
              ))}
            </div>

            <div className="exam__detail-right">
              <CountdownTimer
                title="Thời gian còn lại"
                initialTime={timeLeft}
                onTimeChange={handleTimeChange}
              />
              <div
                className={currentView !== "Trắc nghiệm" ? "display-none" : ""}
              >
                <QuestionBoard
                  questions={questions}
                  selectedAnswers={selectedMultiChoiceAnswers}
                  onQuestionSelect={handleQuestionSelect}
                  onViewChange={handleViewChange}
                  initialView={currentView}
                />
              </div>
              <div className={currentView !== "Bài đọc" ? "display-none" : ""}>
                <QuestionBoard
                  questions={readingQuestions}
                  selectedAnswers={selectedReadingAnswers}
                  onQuestionSelect={handleQuestionSelect}
                  onViewChange={handleViewChange}
                  initialView={currentView}
                />
              </div>
              <div className={currentView !== "Bài nghe" ? "display-none" : ""}>
                <QuestionBoard
                  questions={listeningQuestions}
                  selectedAnswers={selectedListeningAnswers}
                  onQuestionSelect={handleQuestionSelect}
                  onViewChange={handleViewChange}
                  initialView={currentView}
                />
              </div>

              <CandidateAvatarName candidate={candidate} />
              <div className="exam__handin">
                <Button onClick={() => handleHandin()}>Nộp bài thi</Button>
              </div>
            </div>
          </div>
        </>
      )}

      {handin && (
        <>
          <div className="exam__submit">
            <span>Bạn chắc chắn muốn nộp bài thi chứ ?</span>
            <div>
              <Button onClick={() => setHandin(false)}>Quay lại</Button>
              <Button onClick={() => handleSubmit()}>Nộp bài thi</Button>
            </div>
          </div>
        </>
      )}

      {submitted && (
        <>
          <div className="exam__submit">
            <span>Bạn đã nộp bài thành công</span>
            <Button onClick={() => navigate("/client/subject")}>
              Về trang môn thi
            </Button>
          </div>
        </>
      )}

      <Notification
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
    </div>
  );
};

export default Exam;
