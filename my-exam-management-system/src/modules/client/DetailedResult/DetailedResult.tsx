import { APIresultOfCandidate, Question } from '@/interfaces/QuestionInterface/QuestionInterface';
import getAnswerLetter from '@/utilities/getAnswerLetter';
import { Button, CandidateAvatarName, CountdownTimer } from '@components/index';
import { CandidatesInformation } from '@interfaces/CandidateInfoInterface/CandidateInfoInterface';
import { useEffect, useRef, useState } from 'react';
import './DetailedResult.scss';



type Props = {};

const DetailedResult: React.FC<Props> = () => {

    //Mock API Câu hỏi thuộc bài thi này
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

    const paragraphs: { id: number, text: string }[] = [
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


    //Mock API đáp án thí sinh đã chọn

    const resultOfCandidate: APIresultOfCandidate = {
        timeSpent: 2669,
        answers: {
            multipleChoice: { "1": 1, "2": 2, "3": 2, "4": 3, "5": 2, "6": 4, "7": 3, "8": 1, "9": 4, "10": 2, "11": 2, "12": 2, "13": 2, "14": 2, "15": 2, "16": 2, "17": 2, "18": 2, "19": 2, "20": 2 },
            reading: { "1": 1, "2": 1, "3": 2, "4": 1, "5": 2, "6": 2, "7": 1 },
            listening: { "1": 2, "2": 2, "3": 2, "4": 2 }
        }
    }


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

    //audio bài kiểm tra

    // const [playPause, setPlayPause] = useState<boolean>(true);
    const [progress, setProgress] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);


    //Đổi màn loại bài thi
    const [currentView, setCurrentView] = useState<string>('')

    const handleViewChange = (view: string) => {
        setCurrentView(view);
    };


    const chunkQuestions = (questions: Question[], size: number) => {
        const result = [];
        for (let i = 0; i < questions.length; i += size) {
            result.push(questions.slice(i, i + size));
        }
        return result;
    };


    useEffect(() => {
        //API lấy file audio/ link audio rồi gán ref / Mock API audio
        audioRef.current = new Audio("https://www.oxfordonlineenglish.com/wp-content/uploads/2014/02/listening-test-pt-1.mp3?_=1");

        const audioElement = audioRef.current;
        if (audioElement) {
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
            audioRef.current.play();
        }
    };



    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };


    useEffect(() => {
        setCurrentView('Trắc nghiệm');
    }, []);

    return (
        <div className='exam__container'>
            <div className="exam__title">
                <h1>Kết quả bài thi</h1>
            </div>
            <div className="exam__detail">

                {/* Bài trắc nghiệm */}

                <div className={`exam__detail-left no-interact ${currentView === "Trắc nghiệm" ? '' : 'display-none'}`}>
                    {questions.map((question) => (
                        <div key={question.questionNumber} className="exam__question" ref={el => multiChoiceRefs.current[question.questionNumber - 1] = el}>
                            <p>{question.questionNumber}. {question.questionText}</p>
                            {question.image && (
                                <div className="exam__question-image">
                                    <img src={question.image} alt={`Question ${question.questionNumber}`} />
                                </div>
                            )}
                            <div className="exam__answer">
                                {question.answers.map((ans, index) => {
                                    const isSelected = resultOfCandidate.answers.multipleChoice[question.questionNumber] === ans.id;
                                    return (
                                        <div key={ans.id} className={`exam__answer-box ${isSelected ? (ans.isCorrect ? "selected" : "wrong-answer") : ""}`}>
                                            <div className="exam__answer-option"> {getAnswerLetter(index)}</div>
                                            <div className="exam__answer-content">
                                                <div className="exam__answer-text">{ans.text}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bài đọc */}

                <div className={`exam__detail-left no-interact ${currentView === "Bài đọc" ? '' : 'display-none'}`}>
                    <div className='exam__reading'>
                        {paragraphs.map((p) => (
                            <p key={p.id}>{p.text}</p>
                        ))}
                    </div>
                    <div className='exam__reading-answer'>
                        <div>Questions</div>
                        <div>Answers</div>
                    </div>
                    {readingQuestions.map((question) => (
                        <div className='exam__question-radio' ref={el => readingRefs.current[question.questionNumber - 1] = el}>
                            <div>{question.questionText}</div>
                            <div>
                                {question.answers.map((answer, index) => {
                                    const isSelected = resultOfCandidate.answers.reading[question.questionNumber] === answer.id;
                                    return (
                                        <label key={answer.id} htmlFor={`radioSelect-${question.questionNumber}-${index}`} className="exam__question-label">
                                            {answer.text}
                                            <input
                                                className='radioinput'
                                                type="radio"
                                                value={answer.text}
                                                name={`radioSelect-${question.questionNumber}`}
                                                id={`radioSelect-${question.questionNumber}-${index}`}
                                                checked={resultOfCandidate.answers.reading[question.questionNumber] === answer.id}
                                            />
                                            <span className={`radiomark ${isSelected ? (answer.isCorrect ? "" : "wrong-answer") : ""} `}></span>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bài nghe */}

                <div className={`exam__detail-left ${currentView !== "Bài nghe" ? 'display-none' : ''}`}>
                    <div className='exam__audio'>
                        <Button type="button" className="exam__audio-button" onClick={toggleAudio}>Phát</Button>
                        <div>
                            <progress className='exam__audio-progress' value={progress} max={100}></progress>
                            <span>{formatTime(audioRef.current?.currentTime || 0)} / {formatTime(audioRef.current?.duration || 0)}</span>
                        </div>
                    </div>
                    {listeningQuestions.map((question) => (
                        <div key={question.questionNumber} className="exam__question" ref={el => listeningRefs.current[question.questionNumber - 1] = el}>
                            <p>{question.questionNumber}. {question.questionText}</p>
                            {question.image && (
                                <div className="exam__question-image">
                                    <img src={question.image} alt={`Question ${question.questionNumber}`} />
                                </div>
                            )}
                            <div className="exam__answer">
                                {question.answers.map((ans, index) => {
                                    const isSelected = resultOfCandidate.answers.listening[question.questionNumber] === ans.id;
                                    return (
                                        <div key={ans.id} className={`exam__answer-box ${isSelected ? (ans.isCorrect ? "selected" : "wrong-answer") : ""}`}>
                                            <div className="exam__answer-option"> {getAnswerLetter(index)}</div>
                                            <div className="exam__answer-content">
                                                <div className="exam__answer-text">{ans.text}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>



                <div className="exam__detail-right">
                    <CountdownTimer title='Thời gian đã làm bài' initialTime={resultOfCandidate.timeSpent} onTimeChange={() => {}} freezeTime />
                    <div className={currentView !== "Trắc nghiệm" ? 'display-none' : ''}>
                        <div className="question__board">
                            <div className="question__board-heading">
                                <div className="question__board-buttons">
                                    <Button onClick={() => handleViewChange("Trắc nghiệm")}>Trắc nghiệm</Button>
                                    <Button onClick={() => handleViewChange("Bài đọc")}>Bài đọc</Button>
                                    <Button onClick={() => handleViewChange("Bài nghe")}>Bài nghe</Button>
                                </div>
                            </div>
                            <div className="question__board-selection">
                                {chunkQuestions(questions, 5).map((row, rowIndex) => (
                                    <div className="question__row" key={rowIndex}>
                                        {row.map((question) => {
                                            const selectedAnswerId = resultOfCandidate.answers.multipleChoice[question.questionNumber];
                                            const userAnswer = question.answers.find((ans) => ans.id === selectedAnswerId);
                                            const isCorrect = userAnswer ? userAnswer.isCorrect : null;

                                            return (
                                                <div
                                                    className="question__select"
                                                    key={question.questionNumber}
                                                    onClick={() => handleQuestionSelect(question.questionNumber)}
                                                >
                                                    <div className="question__select-number">{question.questionNumber}</div>
                                                    <div className={`question__select-color ${isCorrect === true ? "selected" : isCorrect === false ? "wrong-answer" : ""}`}></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={currentView !== "Bài đọc" ? 'display-none' : ''}>
                        <div className="question__board">
                            <div className="question__board-heading">
                                <div className="question__board-buttons">
                                    <Button onClick={() => handleViewChange("Trắc nghiệm")}>Trắc nghiệm</Button>
                                    <Button onClick={() => handleViewChange("Bài đọc")}>Bài đọc</Button>
                                    <Button onClick={() => handleViewChange("Bài nghe")}>Bài nghe</Button>
                                </div>
                            </div>
                            <div className="question__board-selection">
                                {chunkQuestions(readingQuestions, 5).map((row, rowIndex) => (
                                    <div className="question__row" key={rowIndex}>
                                        {row.map((question) => {
                                            const selectedAnswerId = resultOfCandidate.answers.reading[question.questionNumber];
                                            const userAnswer = question.answers.find((ans) => ans.id === selectedAnswerId);
                                            const isCorrect = userAnswer ? userAnswer.isCorrect : null;

                                            return (
                                                <div
                                                    className="question__select"
                                                    key={question.questionNumber}
                                                    onClick={() => handleQuestionSelect(question.questionNumber)}
                                                >
                                                    <div className="question__select-number">{question.questionNumber}</div>
                                                    <div className={`question__select-color ${isCorrect === true ? "selected" : isCorrect === false ? "wrong-answer" : ""}`}></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={currentView !== "Bài nghe" ? 'display-none' : ''}>
                        <div className="question__board">
                            <div className="question__board-heading">
                                <div className="question__board-buttons">
                                    <Button onClick={() => handleViewChange("Trắc nghiệm")}>Trắc nghiệm</Button>
                                    <Button onClick={() => handleViewChange("Bài đọc")}>Bài đọc</Button>
                                    <Button onClick={() => handleViewChange("Bài nghe")}>Bài nghe</Button>
                                </div>
                            </div>
                            <div className="question__board-selection">
                                {chunkQuestions(listeningQuestions, 5).map((row, rowIndex) => (
                                    <div className="question__row" key={rowIndex}>
                                        {row.map((question) => {
                                            const selectedAnswerId = resultOfCandidate.answers.listening[question.questionNumber];
                                            const userAnswer = question.answers.find((ans) => ans.id === selectedAnswerId);
                                            const isCorrect = userAnswer ? userAnswer.isCorrect : null;

                                            return (
                                                <div
                                                    className="question__select"
                                                    key={question.questionNumber}
                                                    onClick={() => handleQuestionSelect(question.questionNumber)}
                                                >
                                                    <div className="question__select-number">{question.questionNumber}</div>
                                                    <div className={`question__select-color ${isCorrect === true ? "selected" : isCorrect === false ? "wrong-answer" : ""}`}></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <CandidateAvatarName candidate={candidate} />
                </div>
            </div>
        </div>
    );
};

export default DetailedResult;
