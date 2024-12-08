import AsyncSelect from 'react-select/async';
import './ManageReports.scss'
import React, { useEffect, useRef, useState } from 'react';
import { BarChartComponent, Button, PageTitle } from '@/components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PieChartComponent } from '@/components';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '@assets/font/Roboto-Regular-normal.js'
import {applyTheme} from '@/SCSS/applyTheme';
// import BarChartComponent from '@/components/Chart/Barchart/Barchart';

const ManageReports: React.FC = () => {
    applyTheme()

    const [semesterList, setSemesterList] = useState<any>([]);
    // const [subjectList, setSubjectList] = useState<any>([]);
    // const [ExamRoomList, setExamRoomList] = useState<any>([]);
    const [singleSemesterData, setSingleSemesterData] = useState<any>(null);
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
    const ResponseSemesterData: any = {
        semesterName: "Fall 2024",
        semesterCode: "F2024",
        semesterStart: "2024-09-01",
        semesterEnd: "2024-12-15",
        attended: 268,
        notAttended: 15,
        semesterScores: {
            distributionOfScores: [
                { label: "Không đạt", percentage: 24.78 },
                { label: "Khá / giỏi", percentage: 59.04 },
                { label: "Xuất sắc", percentage: 16.18 },
            ],
            scoreRangePercentage: [
                { label: "0-3", percentage: 10 },
                { label: "3-5", percentage: 15 },
                { label: "5-7", percentage: 30 },
                { label: "7-9", percentage: 25 },
                { label: "9-10", percentage: 20 },
            ]
        },
        topPerformers: [
            { studentName: "Nguyễn Hữu Phú", score: 9.8 },
            { studentName: "Nguyễn Mỹ Anh", score: 9.6 },
            { studentName: "Nguyễn Thị Hạnh", score: 9.5 },
        ],
    };

    // const subjectOptions: any[] = [
    //     { id: 1, subjectName: "Kỳ thi Toán học", subjectType: "mon1", startDate: "2024-09-01", endDate: "2024-09-15", status: "Scheduled" },
    //     { id: 2, subjectName: "Kỳ thi Vật lý", subjectType: "mon2", startDate: "2024-09-05", endDate: "2024-09-18", status: "Scheduled" },
    //     { id: 3, subjectName: "Kỳ thi Hóa học", subjectType: "mon3", startDate: "2024-09-10", endDate: "2024-09-20", status: "Scheduled" },
    //     { id: 4, subjectName: "Kỳ thi Lập trình", subjectType: "mon4", startDate: "2024-09-12", endDate: "2024-09-25", status: "Scheduled" },
    //     { id: 5, subjectName: "Kỳ thi Văn học", subjectType: "mon5", startDate: "2024-09-08", endDate: "2024-09-22", status: "Scheduled" },
    // ];
    // const examRoomOptions: any[] = [
    //     { examRoomID: 0, examRoomName: "Room 101", numberOfStudent: 25 },
    //     { examRoomID: 1, examRoomName: "Room 102", numberOfStudent: 30 },
    //     { examRoomID: 2, examRoomName: "Room 103", numberOfStudent: 20 },
    //     { examRoomID: 3, examRoomName: "Room 104", numberOfStudent: 28 },
    //     { examRoomID: 4, examRoomName: "Room 105", numberOfStudent: 32 },
    //     { examRoomID: 5, examRoomName: "Room 106", numberOfStudent: 18 },
    //     { examRoomID: 6, examRoomName: "Room 107", numberOfStudent: 24 },
    //     { examRoomID: 7, examRoomName: "Room 108", numberOfStudent: 22 },
    //     { examRoomID: 8, examRoomName: "Room 109", numberOfStudent: 26 },
    //     { examRoomID: 9, examRoomName: "Room 110", numberOfStudent: 29 },
    // ];
    const APIReturnedReportData = {
        pieChartData: [
            { label: "Không đạt", percentage: 24.78 },
            { label: "Khá / giỏi", percentage: 59.04 },
            { label: "Xuất sắc", percentage: 16.18 },
        ],
        barChartData: [
            { semester: 'Spring 2023', passed: 143, notPassed: 92 },
            { semester: 'Summer 2023', passed: 78, notPassed: 132 },
            { semester: 'Fall 2023', passed: 192, notPassed: 53 },
            { semester: 'Winter 2023', passed: 230, notPassed: 27 },
            { semester: 'Spring 2024', passed: 176, notPassed: 87 },
            { semester: 'Summer 2024', passed: 94, notPassed: 141 },
            { semester: 'Fall 2024', passed: 214, notPassed: 46 },
            { semester: 'Winter 2024', passed: 187, notPassed: 81 },
        ],
        passedVsFailedPieChart: [
            { label: "Không đạt", percentage: 24.78 },
            { label: "Đã vượt", percentage: 75.22 },
        ],
        totalStudents: 2194,
        participated: 1973,
        notParticipated: 221,
        averageScore: 6.1,
        highestScore: 10,
        lowestScore: 3.25,
        mostAchievedScore: 7,

    };

    const loadSemester = () => {
        //api semester list
        const formattedSemesterOptions = semesterOptions.map((semester) => ({
            value: semester.semesterCode,
            label: semester.semesterName,
        }));
        setSemesterList(formattedSemesterOptions);
    }

    // const loadSubject = (chosedSemesterValue: string) => {
    //     if (chosedSemesterValue) {
    //         //api subject list base on chosedSemesterValue
    //         const formattedSubjectOpions = subjectOptions.map((subject) => ({
    //             value: subject.subjectType,
    //             label: subject.subjectName,
    //         }));
    //         setSubjectList(formattedSubjectOpions)
    //     }
    // }

    // const loadExamRoom = (chosedSubjectValue: string) => {
    //     if (chosedSubjectValue) {
    //         //api exam room list base on chosedSubjectValue
    //         const formattedExamRoomOpions = examRoomOptions.map((room) => ({
    //             value: room.examRoomID,
    //             label: room.examRoomName,
    //         }));
    //         setExamRoomList(formattedExamRoomOpions)
    //     }
    // }

    const loadSemesterOptions = (inputValue: string, callback: (options: any[]) => void) => {
        setTimeout(() => {
            callback(semesterList.filter((i: any) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
        }, 1000);
    };

    // const loadSubjectOptions = (inputValue: string, callback: (options: any[]) => void) => {
    //     setTimeout(() => {
    //         callback(subjectList.filter((i: any) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
    //     }, 1000);
    // };

    // const loadExamRoomOptions = (inputValue: string, callback: (options: any[]) => void) => {
    //     setTimeout(() => {
    //         callback(ExamRoomList.filter((i: any) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
    //     }, 1000);
    // };

    const {
        handleSubmit,
        setValue
    } = useForm({})
    const onSubmit: SubmitHandler<any> = (data: any) => {
        // if (data.semester) {
        //     loadSubject(data.semester.value)
        // }
        // if (data.subject) {
        //     loadExamRoom(data.subject.value)
        // }
        if (data.semester) {
            setSingleSemesterData(ResponseSemesterData)
            setTouch(true)
        }
    }

    const handleExportPDF = () => {
        const waitAnimation = setTimeout(() => {
            generatePDF();
            clearTimeout(waitAnimation)
        }, 1000)
    };


    //// PDF ////

    const setTemporaryDimensions = (id: string, width: number, height: number) => {
        const element = document.getElementById(id);
        if (element) {
            element.style.width = `${width}px`;
            element.style.height = `${height}px`;
        }
    };

    const resetDimensions = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.style.width = '';
            element.style.height = '';
        }
    };

    const captureElementAsImage = async (element: HTMLElement) => {
        const canvas = await html2canvas(element, { scale: 2 });
        return { img: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height };
    };

    const generatePDF = async () => {
        const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

        const PXtoMMratio = 0.109375;

        // Select pie chart and bar chart elements
        const pieChart1Element = document.getElementById('piechart1');
        const pieChart2Element = document.getElementById('piechart2');
        const barChartElement = document.getElementById('barchart');

        setTemporaryDimensions('table-container', 1276, 351);  // Lock table size

        // Initialize y-offset for dynamic placement
        let currentYOffset = 40;

        // Add header
        doc.setFont('Roboto-Regular', 'normal');
        doc.setFontSize(20);
        doc.text('Báo cáo thống kê', 105, 20, { align: 'center' });

        // Capture and add pie chart 1
        let pieChart1WidthMM
        let pieChart1HeightMM
        if (pieChart1Element) {
            const pieChart1 = await captureElementAsImage(pieChart1Element);

            pieChart1WidthMM = pieChart1.width * PXtoMMratio;
            pieChart1HeightMM = pieChart1.height * PXtoMMratio;
            // Center and add chart
            doc.addImage(
                pieChart1.img,
                'PNG',
                (210 - pieChart1WidthMM * 2) / 3,
                currentYOffset,
                pieChart1WidthMM,
                pieChart1HeightMM
            );

            // Update y-offset for next chart
            // currentYOffset += pieChart1HeightMM + 10; // Add spacing
        }

        // Capture and add pie chart 2
        if (pieChart2Element) {
            const pieChart2 = await captureElementAsImage(pieChart2Element);

            let pieChart2WidthMM = pieChart2.width * PXtoMMratio;
            let pieChart2HeightMM = pieChart2.height * PXtoMMratio;

            // Center and add chart
            doc.addImage(
                pieChart2.img,
                'PNG',
                (210 - pieChart2WidthMM * 2) * (2 / 3) + pieChart1WidthMM!,
                currentYOffset,
                pieChart2WidthMM,
                pieChart2HeightMM
            );

            // Update y-offset for next chart
            currentYOffset += pieChart2HeightMM + 10; // Add spacing
        }

        // Add bar chart
        if (barChartElement) {
            const barChart = await captureElementAsImage(barChartElement);

            let barChartWidthMM = barChart.width * PXtoMMratio;
            let barChartHeightMM = barChart.height * PXtoMMratio;

            // Adjust minimum dimensions for bar chart
            if (barChartWidthMM < 160) {
                barChartWidthMM = 160;
                barChartHeightMM = 80;
            }

            // Add bar chart
            doc.addImage(
                barChart.img,
                'PNG',
                (210 - barChartWidthMM) / 2,
                currentYOffset,
                barChartWidthMM,
                barChartHeightMM
            );

            currentYOffset += barChartHeightMM + 10;
        }

        // Add table header
        doc.setFontSize(20);
        doc.text('Bảng thống kê số điểm tổng quát', 60, currentYOffset);

        // Add table
        const tableCanvas = await html2canvas(document.getElementById('table-container')!, { scale: 2 });
        const tableImg = tableCanvas.toDataURL('image/png');
        currentYOffset += 20;

        doc.setFontSize(18);
        doc.addImage(tableImg, 'PNG', 10, currentYOffset, 190, 60);

        resetDimensions('table-container');

        // Save PDF
        doc.save('report.pdf');
    };




    useEffect(() => {
        loadSemester()
    }, [])

    return (
        <>
            <div className="report__container">
                <PageTitle theme="light">Tổng quan</PageTitle>

                {/* <div className="report">
                    <div className="report__chart">
                        <div className="report__chart-pie">
                            <PieChartComponent id="piechart1" title="Tỉ lệ xếp hạng" data={APIReturnedReportData.pieChartData} />
                        </div>
                        <div className="report__chart-pie">
                            <PieChartComponent id="piechart2" title="Tỉ lệ vượt qua" data={APIReturnedReportData.passedVsFailedPieChart} />
                        </div>
                        <div className="report__chart-bar">
                            <BarChartComponent id="barchart" data={APIReturnedReportData.barChartData} />
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
                </div> */}

                <div className="report__filter">
                    <form className="report__filter-form">
                        <div className="report__container-child">
                            <p className="report__container-title">Kỳ thi</p>
                            <AsyncSelect cacheOptions loadOptions={loadSemesterOptions} defaultOptions={semesterList} onChange={(value) => {
                                setValue("semester", value);
                                handleSubmit(onSubmit)()
                            }} />
                        </div>
                        {/* <div className="report__container-child">
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
                        </div> */}
                    </form>
                </div>
                <div className="report__file">
                    <Button className={`report__file-btn `} onClick={handleExportPDF}>Xuất file PDF</Button>
                </div>
                {touch && singleSemesterData && (
                    <div className="report">
                        <div className="report__chart2">
                            <div className="report__chart-pie">
                                <PieChartComponent id="piechart3" title="Tỉ lệ xếp hạng" data={singleSemesterData.semesterScores.distributionOfScores} />
                            </div>
                            <div className="report__chart-pie">
                                <PieChartComponent id="piechart4" title="Mức phân bố điểm" data={singleSemesterData.semesterScores.scoreRangePercentage} />
                            </div>
                            {/* <div className="report__chart-bar">
                            <BarChartComponent id="barchnart2" data={APIReturnedReportData.barChartData} />
                        </div> */}
                        </div>
                        <div className='report__statistic'>
                            <h2>Bảng thống kê số điểm tổng quát</h2>
                            <div id="table-container" className='report__table-container'>
                                <table className="report__vertical-table">
                                    <tbody>
                                        <tr>
                                            <th scope="row">Tên học kỳ</th>
                                            <td>{singleSemesterData.semesterName}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Mã học kỳ</th>
                                            <td>{singleSemesterData.semesterCode}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Thời gian bắt đầu</th>
                                            <td>{singleSemesterData.semesterStart}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Thời gian kết thúc</th>
                                            <td>{singleSemesterData.semesterEnd}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Số thí sinh đã tham gia</th>
                                            <td>{singleSemesterData.attended}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Số thí sinh không tham gia</th>
                                            <td>{singleSemesterData.notAttended}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Thí sinh có điểm số cao nhất</th>
                                            <td>{singleSemesterData.topPerformers[0].studentName} - {singleSemesterData.topPerformers[0].score}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Thí sinh có điểm số hạng nhì</th>
                                            <td>{singleSemesterData.topPerformers[1].studentName} - {singleSemesterData.topPerformers[1].score}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Thí sinh có điểm số hạng ba</th>
                                            <td>{singleSemesterData.topPerformers[2].studentName} - {singleSemesterData.topPerformers[2].score}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {!touch && !singleSemesterData && (
                    <>
                        <div>
                            <h2>Hãy chọn kỳ thi, môn thi và phòng thi để hiển thị thông số thống kê.</h2>
                        </div>
                    </>
                )}
                {touch && !singleSemesterData && (
                    <>
                        <div>
                            <h2>Số liệu hiện tại không khả dụng. Xin vui lòng thử lại sau</h2>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ManageReports;
