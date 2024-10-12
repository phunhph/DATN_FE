import React, { useState } from "react";
import "./ManageENExamStructure.scss";
import { Notification } from "../../../components";
import {
    ModuleStructure,
    reqStructure,
    TopicStructure,
    totalStructure,
} from "../../../interface/ManageStructureInterfaces";

interface Errors {
    kyThi?: string;
    monThi?: string;
    tongSoCauHoi?: string;
    thoiGianLamBai?: string;
    [key: string]: string | undefined; // Cho phép các key khác động
}

const ManageENExamStructure = () => {
    const [kyThi, setKyThi] = useState("");
    const [monThi, setMonThi] = useState("");
    const [tongSoCauHoi, setTongSoCauHoi] = useState<string | number>(0);
    const [thoiGianLamBai, setThoiGianLamBai] = useState<string | number>(0);
    const [notifications, setNotifications] = useState<
        Array<{ message: string; isSuccess: boolean }>
    >([]);
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

    const validateForm = () => {
        const newErrors: Errors = {};
        if (!kyThi) newErrors.kyThi = "Bạn phải chọn kỳ thi.";
        if (!monThi) newErrors.monThi = "Bạn phải chọn môn thi.";
        if (!tongSoCauHoi || +tongSoCauHoi <= 0)
            newErrors.tongSoCauHoi = "Số câu hỏi phải lớn hơn 0.";
        if (!thoiGianLamBai || +thoiGianLamBai <= 0)
            newErrors.thoiGianLamBai = "Thời gian làm bài phải lớn hơn 0.";

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
            setErrors({}); // Reset errors
        }
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
                Level: item.Level,
                Quantity: item.Quantity,
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

    const handleOnChange_Exam = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setKyThi(e.target.value);
    };

    const handleOnChange_Subject = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonThi(e.target.value);
    };

    // Dummy Data để render các tùy chọn kỳ thi và môn thi
    const examOptions = [
        { value: "exam1", label: "Kỳ thi 1" },
        { value: "exam2", label: "Kỳ thi 2" },
    ];

    const subjectOptions = [
        { value: "subject1", label: "Môn thi 1" },
        { value: "subject2", label: "Môn thi 2" },
    ];

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
                        {examOptions.map((exam) => (
                            <option key={exam.value} value={exam.value}>
                                {exam.label}
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
                        {subjectOptions.map((subject) => (
                            <option key={subject.value} value={subject.value}>
                                {subject.label}
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

            <hr />
            <div className="Structure__item">
                <h3>Danh sách module</h3>
                <form onSubmit={handleSubmit}>
                    <div className="module">
                        {/* Phần này sẽ hiển thị các module đã chọn */}
                        {/* Bạn có thể thêm code logic render module */}
                    </div>
                    <div className="Button__capnhap">
                        <button type="submit">Submit</button>
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
