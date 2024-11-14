import React, { useState, useRef, useEffect } from 'react';
import './Exam.scss';
import { Question } from '@interfaces/QuestionInterface/QuestionInterface';
import { CandidatesInformation } from '@interfaces/CandidateInfoInterface/CandidateInfoInterface';
import { CandidateAvatarName, QuestionBoard, QuestionAnswerImage, CountdownTimer, Button, Notification } from '@components/index';
import { count } from 'console';
import { useNavigate } from 'react-router-dom';


type Props = {};

const Exam: React.FC<Props> = () => {
    const navigate = useNavigate();

    //Đổi màn loại bài thi
    const [currentView, setCurrentView] = useState<string>('')
    const [notifications, setNotifications] = useState<Array<{ message: string; isSuccess: boolean }>>([]);

    const handleViewChange = (view: string) => {
        setCurrentView(view);
    };

    //mock APi
    const [questions, setQuestions] = useState<Question[]>([
        {
            questionNumber: 1,
            questionText: "What is the capital of France?",
            image: "https://picsum.photos/800/400",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "London", isCorrect: false },
                { id: 3, text: "Berlin", isCorrect: false },
                { id: 4, text: "Madrid", isCorrect: false },
            ]
        },
        {
            questionNumber: 2,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 3,
            questionText: "Which museum is located in Paris?",
            image: "https://picsum.photos/800/400",
            answers: [
                { id: 1, image: "https://picsum.photos/200/200", isCorrect: true },
                { id: 2, text: "British Museum", isCorrect: false },
                { id: 3, text: "Metropolitan Museum", isCorrect: false },
                { id: 4, text: "Prado Museum", isCorrect: false },
            ]
        },
        {
            questionNumber: 4,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 5,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 6,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 7,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 8,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 9,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 10,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 11,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 12,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 13,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 14,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 15,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 16,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 17,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 18,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 19,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
        {
            questionNumber: 20,
            questionText: "Which of the following is known as the 'City of Light'?",
            answers: [
                { id: 1, text: "Paris", isCorrect: true },
                { id: 2, text: "New York", isCorrect: false },
                { id: 3, text: "Tokyo", isCorrect: false },
                { id: 4, text: "Sydney", isCorrect: false },
            ]
        },
    ]);

    const [readingQuestions, setReadingQuestions] = useState<Question[]>([
        {
            questionNumber: 1,
            questionText: "Most people prefer preparing meals at home rather than eating out.",
            answers: [
                { id: 1, text: "True", isCorrect: true },
                { id: 2, text: "False", isCorrect: false }
            ]
        },
        {
            questionNumber: 2,
            questionText: "Grocery stores typically stock more fruits than vegetables.",
            answers: [
                { id: 1, text: "True", isCorrect: false },
                { id: 2, text: "False", isCorrect: true }
            ]
        },
        {
            questionNumber: 3,
            questionText: "Staples are foods that play an important role in the average diet.",
            answers: [
                { id: 1, text: "True", isCorrect: true },
                { id: 2, text: "False", isCorrect: false }
            ]
        },
        {
            questionNumber: 4,
            questionText: "Produce includes both fruits and vegetables.",
            answers: [
                { id: 1, text: "True", isCorrect: true },
                { id: 2, text: "False", isCorrect: false }
            ]
        },
        {
            questionNumber: 5,
            questionText: "Some grocery stores charge for fruit by container rather than by weight or per piece.",
            answers: [
                { id: 1, text: "True", isCorrect: true },
                { id: 2, text: "False", isCorrect: false }
            ]
        },
        {
            questionNumber: 6,
            questionText: 'Most people and families prefer eating at restaurants rather than preparing meals at home.',
            answers: [
                { id: 1, text: "True", isCorrect: false },
                { id: 2, text: "False", isCorrect: true },
            ]
        },
        {
            questionNumber: 7,
            questionText: 'Vegetables are generally stocked more abundantly than fruits in grocery stores because they tend to stay fresh longer.',
            answers: [
                { id: 1, text: "True", isCorrect: true },
                { id: 2, text: "False", isCorrect: false },
            ]
        },
    ])

    const [listeningQuestions, setListeningQuestions] = useState<Question[]>([
        {
            questionNumber: 1,
            questionText: "Where is the woman from?",
            answers: [
                { id: 1, text: "Croatia", isCorrect: true },
                { id: 2, text: "Germany", isCorrect: false },
                { id: 3, text: "Australia", isCorrect: false },
                { id: 4, text: "Russia", isCorrect: false },
            ]
        },
        {
            questionNumber: 2,
            questionText: "The woman says that you can travel from Croatia to Germany in two hours by _________.",
            answers: [
                { id: 1, text: "train", isCorrect: false },
                { id: 2, text: "car", isCorrect: false },
                { id: 3, text: "plane", isCorrect: true },
                { id: 4, text: "bus", isCorrect: false },
            ]
        },
        {
            questionNumber: 3,
            questionText: "What does the man think?",
            answers: [
                { id: 1, text: "Croatia is a part of Germany.", isCorrect: false },
                { id: 2, text: "He doesn't know enough about geography.", isCorrect: true },
                { id: 3, text: "His geography is very good.", isCorrect: false },
                { id: 4, text: "The woman is from Germany.", isCorrect: false },
            ]
        },
        {
            questionNumber: 4,
            questionText: "What does the woman think of the man's mistake?",
            answers: [
                { id: 1, text: "It's very serious.", isCorrect: false },
                { id: 2, text: "It's funny.", isCorrect: true },
                { id: 3, text: "It's stupid.", isCorrect: false },
                { id: 4, text: "It's not serious.", isCorrect: false },
            ]
        }
    ])
    const paragraphs:{id:number, text:string}[] = [
          {
            id: 1,
            text: "While eating at a restaurant is an enjoyable and convenient occasional treat, most individuals and families prepare their meals at home. To make breakfast, lunch, and dinner daily, these persons must have the required foods and ingredients on hand and ready to go; foods and ingredients are typically purchased from a grocery store, or an establishment that distributes foods, drinks, household products, and other items that're used by the typical consumer."
          },
          {
            id: 2,
            text: "Produce, or the term used to describe fresh fruits and vegetables, is commonly purchased by grocery store shoppers. In terms of fruit, most grocery stores offer bananas, apples, oranges, blackberries, raspberries, grapes, pineapples, cantaloupes, watermelons, and more; other grocery stores with larger produce selections might offer the listed fruits in addition to less common fruits, including mangoes, honeydews, starfruits, coconuts, and more."
          },
          {
            id: 3,
            text: "Depending on the grocery store, customers can purchase fruits in a few different ways. Some stores will charge a set amount per pound of fruit, and will weigh customers' fruit purchases and bill them accordingly; other stores will charge customers for each piece of fruit they buy, or for bundles of fruit (a bag of bananas, a bag of apples, etc.); other stores yet will simply charge by the container."
          },
          {
            id: 4,
            text: "Vegetables, including lettuce, corn, tomatoes, onions, celery, cucumbers, mushrooms, and more are also sold at many grocery stores, and are purchased similarly to the way that fruits are. Grocery stores typically stock more vegetables than fruit at any given time, as vegetables remain fresh longer than fruits do, generally speaking."
          },
          {
            id: 5,
            text: "It'd take quite a while to list everything else that today's massive grocery stores sell, but most customers take the opportunity to shop for staples, or foods that play a prominent role in the average diet, at the establishments. Staples include pasta, rice, flour, sugar, milk, meat, and eggs, and bread. All the listed staples are available in prepackaged containers, but can be purchased 'fresh' in some grocery stores, wherein employees will measure and weigh fresh products and then provide them to customers."
          }
        ]
      


    //lăn câu hỏi
    const multiChoiceRefs = useRef<(HTMLDivElement | null)[]>([]);
    const readingRefs = useRef<(HTMLDivElement | null)[]>([]);
    const listeningRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleQuestionSelect = (questionNumber: number) => {
        const questionIndex = questionNumber - 1;
        if (multiChoiceRefs.current[questionIndex]) {
            multiChoiceRefs.current[questionIndex]?.scrollIntoView({ behavior: 'smooth' });
        }
        if (readingRefs.current[questionIndex]) {
            readingRefs.current[questionIndex]?.scrollIntoView({ behavior: 'smooth' });
        }
        if (listeningRefs.current[questionIndex]) {
            listeningRefs.current[questionIndex]?.scrollIntoView({ behavior: 'smooth' });
        }
    };


    //Xử lý các câu hỏi đã đc trả lời
    const [selectedMultiChoiceAnswers, setSelectedMultiChoiceAnswers] = useState<{ [key: number]: number | null }>({});
    const [selectedReadingAnswers, setSelectedReadingAnswers] = useState<{ [key: number]: number | null }>({});
    const [selectedListeningAnswers, setSelectedListeningAnswers] = useState<{ [key: number]: number | null }>({});

    const handleAnswerSelect = (questionNumber: number, answerId: number) => {
        // console.log(`Câu hỏi trắc nghiệm ${questionNumber}, đã chọn đáp án: ${answerId}`);
        setSelectedMultiChoiceAnswers((prev) => {
            const newSelectedMultiChoiceAnswers = {
                ...prev,
                [questionNumber]: answerId
            };
            return newSelectedMultiChoiceAnswers;
        });
    };
    const handleReadingAnswerSelect = (questionNumber: number, answerId: number) => {
        // console.log(`Câu hỏi bài đọc: ${questionNumber}, đã chọn đáp án: ${answerId}`);
        setSelectedReadingAnswers((prev) => {
            const newSelectedReadingAnswers = {
                ...prev,
                [questionNumber]: answerId
            };
            return newSelectedReadingAnswers;
        });
    };
    const handleListeningAnswerSelect = (questionNumber: number, answerId: number) => {
        // console.log(`Câu hỏi bài nghe ${questionNumber}, đã chọn đáp án: ${answerId}`);
        setSelectedListeningAnswers((prev) => {
            const newSelectedMultiChoiceAnswers = {
                ...prev,
                [questionNumber]: answerId
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
            image: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
        }
    ]);

    const candidate = candidates[0];


    //thông bóa
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


    useEffect(() => {
        //API lấy file audio/ link audio
        audioRef.current = new Audio("https://www.oxfordonlineenglish.com/wp-content/uploads/2014/02/listening-test-pt-1.mp3?_=1");

        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.onended = () => {
                setPlayPause(true)
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
                setPlayCount(prevCount => prevCount + 1);
            } else if (playCount >= 3) {
                addNotification("Bạn đã hết lượt nghe.", false);
            }
        }
    };


    //Lấy thời gian còn lại
    const [timeLeft, setTimeLeft] = useState(3600);

    const handleTimeChange = (newTime: number) => {
        setTimeLeft(newTime);
    };
    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };


    // Nộp bài
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [handin, setHandin] = useState<boolean>(false);
    

    const handleHandin = () => {
        // kiểm tra chọn hết câu hỏi trắc nghiệm chưa
        const allMultiChoiceAnswered = questions.every(question =>
            selectedMultiChoiceAnswers[question.questionNumber] !== undefined
        );
        // kiểm tra chọn hết câu hỏi bài đọc chưa
        const allReadingAnswered = readingQuestions.every(question =>
            selectedReadingAnswers[question.questionNumber] !== undefined
        );
        // kiểm tra chọn hết câu hỏi bài đọc chưa
        const allListeningAnswered = listeningQuestions.every(question =>
            selectedListeningAnswers[question.questionNumber] !== undefined
        );

        if (!allMultiChoiceAnswered || !allReadingAnswered || !allListeningAnswered) {
            addNotification('Hãy kiểm tra lại và chọn tất cả đáp án.', false);
            return;
        }


        // addNotification('Đã nộp bài thành công.', true);
        console.log("Thời gian làm bài: " + (3600 - timeLeft))
        console.log("Đáp án trắc nghiệm đã chọn: ", selectedMultiChoiceAnswers);
        console.log("Đáp án bài đọc đã chọn: ", selectedReadingAnswers);
        console.log("Đáp án bài nghe đã chọn: ", selectedListeningAnswers);

        setHandin(true)
    };

    const handleSubmit = () => {
        setHandin(false)
        setSubmitted(true);
    }

    useEffect(() => {
        setCurrentView('Trắc nghiệm');
    }, []);

    return (
        <div className='exam__container'>
            {!submitted && !handin && (
                <>
                    <div className="exam__title">
                        <h1>Làm bài thi</h1>
                    </div>
                    <div className="exam__detail">

                        {/* Bài trắc nghiệm */}

                        <div className={`exam__detail-left ${currentView === "Trắc nghiệm" ? '' : 'display-none'}`}>
                            {questions.map((question, index) => (
                                <div key={question.questionNumber} ref={el => multiChoiceRefs.current[index] = el}>
                                    <QuestionAnswerImage
                                        question={question}
                                        onAnswerSelect={handleAnswerSelect}
                                        selectedAnswerIndex={selectedMultiChoiceAnswers[question.questionNumber] || null}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Bài đọc */}

                        <div className={`exam__detail-left ${currentView === "Bài đọc" ? '' : 'display-none'}`}>
                            <div className='exam__reading'>
                                {paragraphs.map((p) => (
                                    <p key={p.id}>{p.text}</p>
                                ))}
                            </div>
                            <div className='exam__reading-answer'>
                                <div>Questions</div>
                                <div>Answers</div>
                            </div>
                            {readingQuestions.map((question, index) => (
                                <div key={question.questionNumber} ref={el => readingRefs.current[index] = el}>
                                    <QuestionAnswerImage
                                        question={question}
                                        onAnswerSelect={handleReadingAnswerSelect}
                                        selectedAnswerIndex={selectedReadingAnswers[question.questionNumber] || null}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Bài nghe */}

                        <div className={`exam__detail-left ${currentView !== "Bài nghe" ? 'display-none' : ''}`}>
                            <div className='exam__audio'>
                                <Button type="button" className="exam__audio-button" onClick={toggleAudio}>Phát</Button>
                                <p>Số lần phát còn lại: {3 - playCount} lần</p>
                                <div>
                                    <progress className='exam__audio-progress' value={progress} max={100}></progress>
                                    <span>{formatTime(audioRef.current?.currentTime || 0)} / {formatTime(audioRef.current?.duration || 0)}</span>
                                </div>
                            </div>
                            {listeningQuestions.map((question, index) => (
                                <div key={question.questionNumber} ref={el => listeningRefs.current[index] = el}>
                                    <QuestionAnswerImage
                                        question={question}
                                        onAnswerSelect={handleListeningAnswerSelect}
                                        selectedAnswerIndex={selectedListeningAnswers[question.questionNumber] || null}
                                    />
                                </div>
                            ))}
                        </div>



                        <div className="exam__detail-right">
                            <CountdownTimer title='Thời gian còn lại' initialTime={timeLeft} onTimeChange={handleTimeChange} />
                            <div className={currentView !== "Trắc nghiệm" ? 'display-none' : ''}>
                                <QuestionBoard
                                    questions={questions}
                                    selectedAnswers={selectedMultiChoiceAnswers}
                                    onQuestionSelect={handleQuestionSelect}
                                    onViewChange={handleViewChange}
                                    initialView={currentView}
                                />
                            </div>
                            <div className={currentView !== "Bài đọc" ? 'display-none' : ''}>
                                <QuestionBoard
                                    questions={readingQuestions}
                                    selectedAnswers={selectedReadingAnswers}
                                    onQuestionSelect={handleQuestionSelect}
                                    onViewChange={handleViewChange}
                                    initialView={currentView}
                                />
                            </div>
                            <div className={currentView !== "Bài nghe" ? 'display-none' : ''}>
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
                    <div className='exam__submit'>
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
                    <div className='exam__submit'>
                        <span>Bạn đã nộp bài thành công</span>
                        <Button onClick={() => navigate('/client/subject')}>Về trang môn thi</Button>
                    </div>
                </>
            )}

            <Notification
                notifications={notifications}
                clearNotifications={clearNotifications}
            />
        </div>
    );
}

export default Exam;
