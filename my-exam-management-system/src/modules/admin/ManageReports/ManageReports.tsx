import AsyncSelect from 'react-select/async';
import './ManageReports.scss'
import React, { useEffect, useRef, useState } from 'react';
import { Button, PageTitle } from '@/components';
import { SubmitHandler, useForm } from 'react-hook-form';
import {PieChartComponent, LineChartComponent} from '@/components';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '@assets/font/Roboto-Regular-normal.js'

const ManageReports: React.FC = () => {
    const [semesterList, setSemesterList] = useState<any>([]);
    const [subjectList, setSubjectList] = useState<any>([]);
    const [ExamRoomList, setExamRoomList] = useState<any>([]);
    const [reportData, setReportData] = useState<any>(null);
    const [touch, setTouch] = useState<boolean>(false);


    // mock data
    const semesterOptions: any[] = [
        {
            semesterName: "Fall 2024",
            semesterCode: "F2024",
            semesterStart: "2024-09-01",
            semesterEnd: "2024-12-15",
        },
        {
            semesterName: "Spring 2024",
            semesterCode: "S2024",
            semesterStart: "2024-01-10",
            semesterEnd: "2024-05-15",
        },
        {
            semesterName: "Summer 2024",
            semesterCode: "SU2024",
            semesterStart: "2024-06-01",
            semesterEnd: "2024-08-31",
        },
        {
            semesterName: "Winter 2024",
            semesterCode: "W2024",
            semesterStart: "2024-12-16",
            semesterEnd: "2024-01-09",
        },
        {
            semesterName: "Fall 2023",
            semesterCode: "F2023",
            semesterStart: "2023-09-01",
            semesterEnd: "2023-12-15",
        },
        {
            semesterName: "Spring 2023",
            semesterCode: "S2023",
            semesterStart: "2023-01-10",
            semesterEnd: "2023-05-15",
        },
        {
            semesterName: "Summer 2023",
            semesterCode: "SU2023",
            semesterStart: "2023-06-01",
            semesterEnd: "2023-08-31",
        },
    ];
    const subjectOptions: any[] = [
        { id: 1, subjectName: "Kỳ thi Toán học", subjectType: "mon1", startDate: "2024-09-01", endDate: "2024-09-15", status: "Scheduled" },
        { id: 2, subjectName: "Kỳ thi Vật lý", subjectType: "mon2", startDate: "2024-09-05", endDate: "2024-09-18", status: "Scheduled" },
        { id: 3, subjectName: "Kỳ thi Hóa học", subjectType: "mon3", startDate: "2024-09-10", endDate: "2024-09-20", status: "Scheduled" },
        { id: 4, subjectName: "Kỳ thi Lập trình", subjectType: "mon4", startDate: "2024-09-12", endDate: "2024-09-25", status: "Scheduled" },
        { id: 5, subjectName: "Kỳ thi Văn học", subjectType: "mon5", startDate: "2024-09-08", endDate: "2024-09-22", status: "Scheduled" },
    ];
    const examRoomOptions: any[] = [
        { examRoomID: 0, examRoomName: "Room 101", numberOfStudent: 25 },
        { examRoomID: 1, examRoomName: "Room 102", numberOfStudent: 30 },
        { examRoomID: 2, examRoomName: "Room 103", numberOfStudent: 20 },
        { examRoomID: 3, examRoomName: "Room 104", numberOfStudent: 28 },
        { examRoomID: 4, examRoomName: "Room 105", numberOfStudent: 32 },
        { examRoomID: 5, examRoomName: "Room 106", numberOfStudent: 18 },
        { examRoomID: 6, examRoomName: "Room 107", numberOfStudent: 24 },
        { examRoomID: 7, examRoomName: "Room 108", numberOfStudent: 22 },
        { examRoomID: 8, examRoomName: "Room 109", numberOfStudent: 26 },
        { examRoomID: 9, examRoomName: "Room 110", numberOfStudent: 29 },
    ];
    const APIReturnedReportData: any = {
        lineChartData: [
            { score: 0, students: 2 },
            { score: 1, students: 5 },
            { score: 2, students: 8 },
            { score: 3, students: 12 },
            { score: 4, students: 20 },
            { score: 5, students: 17 },
            { score: 6, students: 25 },
            { score: 7, students: 18 },
            { score: 8, students: 23 },
            { score: 9, students: 7 },
            { score: 10, students: 3 },
        ],
        pieChartData: [
            { label: "Không đạt", percentage: 30 },
            { label: "Khá / giỏi", percentage: 42 },
            { label: "Xuất sắc", percentage: 28 },
        ],
        totalStudents: 100,
        participated: 90,
        notParticipated: 10,
        averageScore: 5.8,
        highestScore: 10,
        lowestScore: 0,
        mostAchievedScore: 5,
    };

    const loadSemester = () => {
        //api semester list
        const formattedSemesterOptions = semesterOptions.map((semester) => ({
            value: semester.semesterCode,
            label: semester.semesterName,
        }));
        setSemesterList(formattedSemesterOptions);
    }

    const loadSubject = (chosedSemesterValue: string) => {
        if (chosedSemesterValue) {
            //api subject list base on chosedSemesterValue
            const formattedSubjectOpions = subjectOptions.map((subject) => ({
                value: subject.subjectType,
                label: subject.subjectName,
            }));
            setSubjectList(formattedSubjectOpions)
        }
    }

    const loadExamRoom = (chosedSubjectValue: string) => {
        if (chosedSubjectValue) {
            //api exam room list base on chosedSubjectValue
            const formattedExamRoomOpions = examRoomOptions.map((room) => ({
                value: room.examRoomID,
                label: room.examRoomName,
            }));
            setExamRoomList(formattedExamRoomOpions)
        }
    }

    const loadSemesterOptions = (inputValue: string, callback: (options: any[]) => void) => {
        setTimeout(() => {
            callback(semesterList.filter((i: any) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
        }, 1000);
    };

    const loadSubjectOptions = (inputValue: string, callback: (options: any[]) => void) => {
        setTimeout(() => {
            callback(subjectList.filter((i: any) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
        }, 1000);
    };

    const loadExamRoomOptions = (inputValue: string, callback: (options: any[]) => void) => {
        setTimeout(() => {
            callback(ExamRoomList.filter((i: any) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
        }, 1000);
    };

    const {
        handleSubmit,
        setValue
    } = useForm({})
    const onSubmit: SubmitHandler<any> = (data: any) => {
        console.log(data)
        if (data.semester) {
            loadSubject(data.semester.value)
        }
        if (data.subject) {
            loadExamRoom(data.subject.value)
        }
        if (data.semester && data.subject && data.room) {
            // api get report data
            setReportData(APIReturnedReportData)
            setTouch(true)
        }
    }

    const handleExportPDF = () => {
        generatePDF()
    };
    
    const chartRef = useRef<HTMLDivElement | null>(null);

    // const generatePDF = async () => {
    //     const pdf = new jsPDF({
    //         orientation: 'portrait',
    //         unit: 'mm',
    //         format: 'a4',
    //     });

        // pdf.setFont('Roboto-Regular', 'normal');
        // pdf.setFontSize(20);
        // pdf.text('Báo cáo thống kê', 105, 20, { align: 'center' });

    //     if (chartRef.current) {
    //         const canvas = await html2canvas(chartRef.current, {scale: 2})
    //         const chartImg = canvas.toDataURL('image/png');

    //         pdf.addImage(chartImg, 'PNG', 10, 40, 190, 100); // Adjust width (190) and height (100)

    //     }

    //     pdf.setFontSize(20);
    //     pdf.text('Bảng thống kê số điểm tổng quát', 10, 120);

    //     let y = 130; // initial table position
    //     const rowHeight = 10; // line height
    //     const tableData = [
    //         ['Tổng số lượng sinh viên', APIReturnedReportData.totalStudents],
    //         ['Số lượng thí sinh tham gia thi', APIReturnedReportData.participated],
    //         ['Số lượng thí sinh bỏ thi', APIReturnedReportData.notParticipated],
    //         ['Điểm trung bình', APIReturnedReportData.averageScore],
    //         ['Điểm cao nhất', APIReturnedReportData.highestScore],
    //         ['Điểm thấp nhất', APIReturnedReportData.lowestScore],
    //         ['Số điểm có nhiều thí sinh nhất', APIReturnedReportData.mostAchievedScore],
    //     ];

    //     tableData.forEach(([label, value]) => {
    //         pdf.text(`${label}: ${value}`, 10, y);
    //         y += rowHeight;
    //     });

    //     pdf.save('report.pdf');
    // };

    const generatePDF = async () => {
        const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      
        doc.setFont('Roboto-Regular', 'normal');
        doc.setFontSize(20);
        doc.text('Báo cáo thống kê', 105, 20, { align: 'center' });

      
        // Capture chart elements as images
        const chartCanvas1 = await html2canvas(document.getElementById('piechart')!, { scale: 2 });
        const chartCanvas2 = await html2canvas(document.getElementById('linechart')!, { scale: 2 });
        const tableCanvas = await html2canvas(document.getElementById('table-container')!, { scale: 2 });
      
        // Convert canvases to images
        const chartImg1 = chartCanvas1.toDataURL('image/png');
        const chartImg2 = chartCanvas2.toDataURL('image/png');
        const tableImg = tableCanvas.toDataURL('image/png');
      
        // Add charts side by side
        doc.addImage(chartImg1, 'PNG', 42, 40, 124, 55); 
        doc.addImage(chartImg2, 'PNG', 12, 100, 190, 100); 
      
        doc.setFontSize(20); // Increase font size for the heading
        doc.text('Bảng thống kê số điểm tổng quát', 10, 210);

        // Add table below the charts
        doc.setFontSize(18)
        doc.addImage(tableImg, 'PNG', 10, 220, 190, 60); 
      
        // Save the PDF
        doc.save('report.pdf');
      };
      
    useEffect(() => {
        loadSemester()
    }, [])

    return (
        <>
            <div className="report__container">
                <PageTitle theme="light">Quản lý phòng thi</PageTitle>
                <div className="report__filter">
                    <form className="report__filter-form">
                        <div className="report__container-child">
                            <p className="report__container-title">Kỳ thi</p>
                            <AsyncSelect cacheOptions loadOptions={loadSemesterOptions} defaultOptions={semesterList} onChange={(value) => {
                                setValue("semester", value);
                                handleSubmit(onSubmit)()
                            }} />
                        </div>
                        <div className="report__container-child">
                            <p className="report__container-title">Môn thi</p>
                            <AsyncSelect cacheOptions loadOptions={loadSubjectOptions} defaultOptions={subjectList} onChange={(value) => {
                                setValue("subject", value);
                                handleSubmit(onSubmit)()
                            }} />
                        </div>
                        <div className="report__container-child">
                            <p className="report__container-title">Phòng thi</p>
                            <AsyncSelect cacheOptions loadOptions={loadExamRoomOptions} defaultOptions={ExamRoomList} onChange={(value) => {
                                setValue("room", value);
                                handleSubmit(onSubmit)()
                            }} />
                        </div>
                    </form>
                </div>
                <div className="report__file">
                    <Button className="report__file-btn" onClick={handleExportPDF}>Xuất file PDF</Button>
                </div>
                {touch && reportData && (
                    <div ref={chartRef}>
                        <div className="report__chart">
                            <div className="report__chart-pie">
                                <PieChartComponent data={APIReturnedReportData.pieChartData} />
                            </div>
                            <div className="report__chart-line">
                                <LineChartComponent data={APIReturnedReportData.lineChartData}/>
                            </div>
                        </div>
                        <div className='report__statistic'>
                            <h2>Bảng thống kê số điểm tổng quát</h2>
                            <div id="table-container" className='report__table-container'>
                                <table className="report__vertical-table">
                                    <tbody>
                                        <tr>
                                            <th scope="row">Tổng số lượng thí sinh</th>
                                            <td>{APIReturnedReportData.totalStudents}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Số lượng thí sinh tham gia thi</th>
                                            <td>{APIReturnedReportData.participated}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Số lượng thí sinh bỏ thi</th>
                                            <td>{APIReturnedReportData.notParticipated}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Điểm trung bình</th>
                                            <td>{APIReturnedReportData.averageScore}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Điểm cao nhất</th>
                                            <td>{APIReturnedReportData.highestScore}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Điểm thấp nhất</th>
                                            <td>{APIReturnedReportData.lowestScore}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Số điểm có nhiều thí sinh nhất</th>
                                            <td>{APIReturnedReportData.mostAchievedScore}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {!touch && !reportData && (
                    <>
                        <div>
                            <h2>Hãy chọn kỳ thi, môn thi và phòng thi để hiển thị thông số thống kê</h2>
                        </div>
                    </>
                )}
                {touch && !reportData && (
                    <>
                        <div>
                            <h2>Hãy chọn kỳ thi, môn thi và phòng thi để hiển thị thông số thống kê</h2>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ManageReports;
