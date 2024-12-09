import React, { useEffect, useState } from "react";
import "./ManageENExamStructure.scss";
import { Button, Notification } from "../../../components";
import {
  ModuleStructure,
  reqStructure,
  totalStructure,
} from "@/interfaces/ManageStructureInterfaces/ManageStructureInterfaces";
import { getAllSemesterWithExamSubject } from "@/services/repositories/SemesterServices/SemesterServices";
import { Semester } from "@/interfaces/SemesterInterface/SemestertInterface";
import { getAllExamSubjectByIdSemesterWithContent } from "@/services/repositories/ExamSubjectService/ExamSubjectService";
import { ExamSubject } from "@/interfaces/SubjectInterface/ExamSubjectInterface";
import {
  getAllStrutureByIdSubject,
  getFinalStructure,
  SubmitStructure,
} from "@/services/repositories/StructureServices/StructureDetailServices";
import {applyTheme} from "@/SCSS/applyTheme";
import { useAdminAuth } from "@/hooks";

interface Errors {
  kyThi?: string;
  monThi?: string;
  tongSoCauHoi?: string;
  thoiGianLamBai?: string;
  [key: string]: string | undefined; // Cho phép các key khác động
}

const ManageENExamStructure = () => {
    useAdminAuth();
    applyTheme()

  const [kyThi, setKyThi] = useState("");
  const [semester, setSemester] = useState<Semester[]>([]);
  const [monThi, setMonThi] = useState("");
  const [examSubjects, setExamSubject] = useState<ExamSubject[]>([]);
  const [modules, setModules] = useState<ModuleStructure[]>([]);
  const [checkCreateStruct, setCheckCreateStruct] = useState(true);
  const [tongSoCauHoi, setTongSoCauHoi] = useState<string | number>(0);
  const [thoiGianLamBai, setThoiGianLamBai] = useState<string | number>(0);
  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);
  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };
  const [errors, setErrors] = useState<Errors>({});

  const scrollToFirstError = () => {
    const firstErrorElement = document.querySelector(".error__number");
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleInputChange = (
    moduleIndex: number,
    levelIndex: number,
    newValue: string
  ) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].levels[levelIndex].quantity =
      parseInt(newValue, 10) || 0;
    setModules(updatedModules);
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!kyThi) newErrors.kyThi = "Bạn phải chọn kỳ thi.";
    if (!monThi) newErrors.monThi = "Bạn phải chọn môn thi.";
    if (!tongSoCauHoi || +tongSoCauHoi <= 0)
      newErrors.tongSoCauHoi = "Số câu hỏi phải lớn hơn 0.";
    if (!thoiGianLamBai || +thoiGianLamBai <= 0)
      newErrors.thoiGianLamBai = "Thời gian làm bài phải lớn hơn 0.";

    let totalQuestions = 0;

    modules.forEach((module, moduleIndex) => {
      module.levels.forEach((level, levelIndex) => {
        const number = +level.quantity;

        if (number <= 0) {
          newErrors[`module-${moduleIndex}-level-${levelIndex}`] =
            "Số câu phải lớn hơn 0.";
        } else if (number > level.total) {
          newErrors[
            `module-${moduleIndex}-level-${levelIndex}`
          ] = `Số câu không được vượt quá ${level.total}.`;
        }

        totalQuestions += number;
      });
    });

    if (+tongSoCauHoi > totalQuestions) {
      newErrors.tongSoCauHoi = `Số câu hỏi phải lớn hơn 0 và không được vượt quá tổng số câu hỏi (${totalQuestions}).`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      scrollToFirstError();
      return false;
    }

    return true;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      submit();
      setErrors({});

    }
  };

  const submit = async () => {
    const body: reqStructure = {
      time: thoiGianLamBai,
      total: tongSoCauHoi,
      modules: modules,
      checkCreateStruct: checkCreateStruct,
      subject: monThi,
      exam: kyThi,
    };
    const data = await SubmitStructure(body);
    console.log("Submitted Modules:", data);
    addNotification("Submit sucssecfully", true);
    setCheckCreateStruct(true);
  };

  const groupByTitle = (data: totalStructure[]): ModuleStructure[] => {
    const result: ModuleStructure[] = [];
    const groupedData: Record<string, totalStructure[]> = {};
    data.forEach((e) => {
      if (e.title) {
        if (!groupedData[e.title]) {
          groupedData[e.title] = [];
        }
        groupedData[e.title].push(e);
      }
    });

    for (const title in groupedData) {
      const levels: totalStructure[] = groupedData[title].map((item) => ({
        title: item.title,
        level: item.level,
        quantity: item.quantity,
        total: item.total,
      }));
      const moduleStructure: ModuleStructure = {
        title: title,
        levels: levels,
      };
      result.push(moduleStructure);
    }
    return result;
  };

  const getSubjectsByIdExam = async (id: string) => {
    const dataSubject = await getAllExamSubjectByIdSemesterWithContent(id);
    if (dataSubject.success) {
      const subjectsWithoutId: ExamSubject[] = dataSubject.data;
      const subjectId = String(subjectsWithoutId[0].id);
      setMonThi(subjectId);
      await getStructureSubjiect(subjectId)
      setExamSubject(subjectsWithoutId);
    } else {
      setExamSubject([]);
      addNotification(dataSubject.message, dataSubject.success);
    }
    return dataSubject;
  };

  const getStructureSubjiect = async (id: string) => {
    const data = await getAllStrutureByIdSubject(id);

    if (data.success) {
      setTongSoCauHoi(data.data[0].quantity);
      setThoiGianLamBai(data.data[0].time);
      setCheckCreateStruct(true);

    } else {
      setCheckCreateStruct(false);
      setTongSoCauHoi(0);
      setThoiGianLamBai(0);
    }

    const subjectDetail = await getFinalStructure(id);
    console.log(subjectDetail);

    if (subjectDetail.success) {
      const data = groupByTitle(subjectDetail.data);
      setModules(data);
    }
  };

  const onLoad = async () => {
    try {
      const data = await getAllSemesterWithExamSubject();

      if (!data.success || !data.data) {
        addNotification(data.message, data.success);
        throw new Error("Failed to get exams.");
      }
      console.log(data);

      setSemester(data.data);
      if (data.data.length === 0 || !data.data[0].id) {
        throw new Error("No valid exams found.");
      }

      const examId = String(data.data[0].id);
      setKyThi(examId);
      const subjects = await getSubjectsByIdExam(examId);

      const subjectId = String(subjects.data[0].id);
      await getStructureSubjiect(subjectId);


    } catch (error) {
      console.error("Error in dataStart:", error);
    }
  };
  const handleOnChange_Exam = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setKyThi(e.target.value);
    await getSubjectsByIdExam(e.target.value);
  };

  const handleOnChange_Subject = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonThi(e.target.value);
    const subjectDetail = await getFinalStructure(e.target.value);
    await getStructureSubjiect(e.target.value);
    console.log(subjectDetail);

    if (subjectDetail.success) {
      const data = groupByTitle(subjectDetail.data);
      setModules(data);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);
  return (
    <div className="Structure">
      <div className="Structure__title">
        <h1>Soạn cấu trúc đề</h1>
      </div>
      <div className="Structure__content">
        <div className="form-group">
          <label htmlFor="kyThi">Chọn kỳ thi:</label>
          <select id="kyThi" value={kyThi} onChange={handleOnChange_Exam}>
            <option value="">Chọn kỳ thi</option>
            {semester.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.name}
              </option>
            ))}
          </select>
          {errors.kyThi && (
            <span className="error__number">{errors.kyThi}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="monThi">Chọn môn thi:</label>
          <select id="monThi" value={monThi} onChange={handleOnChange_Subject}>
            <option value="">Chọn môn thi</option>
            {examSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.monThi && (
            <span className="error__number">{errors.monThi}</span>
          )}
        </div>
        <div className="form-row">
          <div className="form-group1">
            <label htmlFor="tongSoCauHoi">Tổng số câu hỏi:</label>
            <input
              type="number"
              id="tongSoCauHoi"
              value={tongSoCauHoi}
              onChange={(e) => setTongSoCauHoi(e.target.value)}
            />
            {errors.tongSoCauHoi && (
              <span className="error__number">{errors.tongSoCauHoi}</span>
            )}
          </div>
          <div className="form-group1">
            <label htmlFor="thoiGianLamBai">Thời gian làm bài:</label>
            <input
              type="number"
              id="thoiGianLamBai"
              value={thoiGianLamBai}
              onChange={(e) => setThoiGianLamBai(e.target.value)}
            />
            <span>(phút)</span>
            {errors.thoiGianLamBai && (
              <span className="error__number">{errors.thoiGianLamBai}</span>
            )}
          </div>
        </div>
      </div>

      <div className="Structure__item">
        <h3>Danh sách module</h3>
        <form onSubmit={handleSubmit}>
          <div className="module">
            {/* Phần này sẽ hiển thị các module đã chọn */}
            {modules.map((module, moduleIndex) => (
              <div className="module__item" key={moduleIndex}>
                {/* <h1>{module.title}</h1> */}
                <div className="module__title">
                  <h4 className="lever">Nội dung thi</h4>
                  <h4 className="quantity">Số lượng</h4>
                  <h4 className="number">Số câu</h4>
                </div>
                {module.levels.map((level, levelIndex) => (
                  <div className="module__title" key={levelIndex}>
                    <p className="lever lever_content">{module.title}</p>
                    <p className="quantity">{level.total}</p>
                    <div className="number grid_input">
                      <input
                        type="number"
                        className="input__number"
                        value={level.quantity}
                        onChange={(e) =>
                          handleInputChange(
                            moduleIndex,
                            levelIndex,
                            e.target.value
                          )
                        }
                      />
                      {errors[`module-${moduleIndex}-level-${levelIndex}`] && (
                        <span className="error__number">
                          {errors[`module-${moduleIndex}-level-${levelIndex}`]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {/* Bạn có thể thêm code logic render module */}
          </div>
          <div className="Button__capnhap">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
      <Notification
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
    </div>
  );
};

export default ManageENExamStructure;
