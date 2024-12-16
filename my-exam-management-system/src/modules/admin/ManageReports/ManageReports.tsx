import { applyTheme } from "@/SCSS/applyTheme";
import { Button, PageTitle, PieChartComponent } from "@/components";
import { useAdminAuth } from "@/hooks";
import { getAllExamSubjectByIdSemester } from "@/services/repositories/ExamSubjectService/ExamSubjectService";
import {
  getAllExams,
  getExamRoomsByExam,
  getReportByExam,
  getReportByRoom,
  getReportBySubject,
} from "@/services/repositories/PointService/PointService";
import "@assets/font/Roboto-Regular-normal.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useCallback, useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import "./ManageReports.scss";
// import BarChartComponent from '@/components/Chart/Barchart/Barchart';

interface SelectOption {
  value: string;
  label: string;
}

interface SemesterScoreDistribution {
  label: string;
  percentage: number;
}

interface SemesterScoreRange {
  label: string;
  percentage: number;
}

interface TopPerformer {
  studentName: string;
  score: number;
}

interface ResponseSemesterData {
  semesterName: string;
  semesterCode: string;
  semesterStart: string;
  semesterEnd: string;
  attended: number;
  notAttended: number;
  semesterScores: {
    distributionOfScores: SemesterScoreDistribution[];
    scoreRangePercentage: SemesterScoreRange[];
  };
  topPerformers: TopPerformer[];
}

const ManageReports: React.FC = () => {
  useAdminAuth();
  applyTheme();

  const [semesterList, setSemesterList] = useState<SelectOption[]>([]);
  const [subjectList, setSubjectList] = useState<SelectOption[]>([]);
  const [ExamRoomList, setExamRoomList] = useState<SelectOption[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<SelectOption | null>(
    null
  );
  // const [selectedExamRoom, setSelectedExamRoom] = useState<SelectOption | null>(
  //   null
  // );
  // const [selectedExamSubject, setSelectedSubject] =
  //   useState<SelectOption | null>(null);
  const [singleSemesterData, setSingleSemesterData] = useState<any>(null);
  const [touch, setTouch] = useState<boolean>(false);

  const loadSemester = useCallback(async () => {
    try {
      const response = await getAllExams();
      if (response.success && response.data) {
        const formattedOptions = response.data.map((exam) => ({
          value: exam.id,
          label: exam.name,
        }));
        setSemesterList(formattedOptions);

        const defaultSemester = formattedOptions[formattedOptions.length - 1];
        setSelectedSemester(defaultSemester);
        if (defaultSemester?.value) {
          await loadReports_exam(defaultSemester.value);
          await loadExamRooms(defaultSemester.value);
          await loadSubject(defaultSemester.value);
        }
      }
    } catch (error) {
      console.error("Error loading semesters:", error);
    }
  }, []);
  function parseTopScores(
    topScores: string
  ): { name: string; point: number }[] {
    return topScores.split(",").map((item) => {
      const [name, point] = item.trim().split(" - ");
      return {
        name: name.trim(),
        point: parseFloat(point.trim()),
      };
    });
  }
  const loadReports_exam = useCallback(async (examId: string) => {
    try {
      const response = await getReportByExam(examId);

      if (response.status == 200) {
        const data = response.data[0];

        const topPerformers = parseTopScores(data.top_3_scores).map((score) => {
          // Bạn có thể thực hiện thêm các thao tác với từng đối tượng ở đây
          return {
            studentName: score.name,
            score: score.point,
          };
        });

        const report: ResponseSemesterData = {
          semesterName: data.name,
          semesterCode: data.id,
          semesterStart: data.time_start,
          semesterEnd: data.time_end,
          attended: data.candidate_join,
          notAttended: data.absent_candidate,
          semesterScores: {
            distributionOfScores: [
              { label: "Không đạt", percentage: data.weak_percentage },
              { label: "Trung bình", percentage: data.average_percentage },
              { label: "Khá / giỏi", percentage: data.good_percentage },
              { label: "Xuất sắc", percentage: data.excellent_percentage },
            ],
            scoreRangePercentage: [
              { label: "0-3", percentage: data.weak_count },
              { label: "3-5", percentage: data.weak_2_count },
              { label: "5-7", percentage: data.average_count },
              { label: "7-9", percentage: data.good_count },
              { label: "9-10", percentage: data.excellent_count },
            ],
          },
          topPerformers: topPerformers,
        };
        setSingleSemesterData(report);
        setTouch(true);
      }
    } catch (error) {
      console.error("Error loading exam rooms:", error);
    }
  }, []);
  const loadReports_room = useCallback(async (examId: string, roomId:string) => {
    try {
      const response = await getReportByRoom(examId, roomId);

      if (response.status == 200) {
        const data = response.data[0];

        const topPerformers = parseTopScores(data.top_3_scores).map((score) => {
          // Bạn có thể thực hiện thêm các thao tác với từng đối tượng ở đây
          return {
            studentName: score.name,
            score: score.point,
          };
        });

        const report: ResponseSemesterData = {
          semesterName: data.name,
          semesterCode: data.id,
          semesterStart: data.time_start,
          semesterEnd: data.time_end,
          attended: data.candidate_join,
          notAttended: data.absent_candidate,
          semesterScores: {
            distributionOfScores: [
              { label: "Không đạt", percentage: data.weak_percentage },
              { label: "Trung bình", percentage: data.average_percentage },
              { label: "Khá / giỏi", percentage: data.good_percentage },
              { label: "Xuất sắc", percentage: data.excellent_percentage },
            ],
            scoreRangePercentage: [
              { label: "0-3", percentage: data.weak_count },
              { label: "3-5", percentage: data.weak_2_count },
              { label: "5-7", percentage: data.average_count },
              { label: "7-9", percentage: data.good_count },
              { label: "9-10", percentage: data.excellent_count },
            ],
          },
          topPerformers: topPerformers,
        };
        setSingleSemesterData(report);
        setTouch(true);
      }
    } catch (error) {
      console.error("Error loading exam rooms:", error);
    }
  }, []);
  const loadReports_subject = useCallback(async (examId: string, subecjtId:string) => {
    try {
      const response = await getReportBySubject(examId,subecjtId);

      if (response.status == 200) {
        const data = response.data[0];
        
        const topPerformers = parseTopScores(data.top_3_scores).map((score) => {
          // Bạn có thể thực hiện thêm các thao tác với từng đối tượng ở đây
          return {
            studentName: score.name,
            score: score.point,
          };
        });

        const report: ResponseSemesterData = {
          semesterName: data.name,
          semesterCode: data.id,
          semesterStart: data.time_start,
          semesterEnd: data.time_end,
          attended: data.candidate_join,
          notAttended: data.absent_candidate,
          semesterScores: {
            distributionOfScores: [
              { label: "Không đạt", percentage: data.weak_percentage },
              { label: "Trung bình", percentage: data.average_percentage },
              { label: "Khá / giỏi", percentage: data.good_percentage },
              { label: "Xuất sắc", percentage: data.excellent_percentage },
            ],
            scoreRangePercentage: [
              { label: "0-3", percentage: data.weak_count },
              { label: "3-5", percentage: data.weak_2_count },
              { label: "5-7", percentage: data.average_count },
              { label: "7-9", percentage: data.good_count },
              { label: "9-10", percentage: data.excellent_count },
            ],
          },
          topPerformers: topPerformers,
        };
        setSingleSemesterData(report);
        setTouch(true);
      }
    } catch (error) {
      console.error("Error loading exam rooms:", error);
    }
  }, []);
  const loadSubject = useCallback(async (examId: string) => {
    try {
      const response = await getAllExamSubjectByIdSemester(examId);
      if (response.success && response.data) {
        const formattedOptions = response.data.map((room) => ({
          value: room.id,
          label: room.name,
        }));
        setSubjectList(formattedOptions);
      }
    } catch (error) {
      console.error("Error loading exam rooms:", error);
    }
  }, []);

  const loadExamRooms = useCallback(async (examId: string) => {
    try {
      const response = await getExamRoomsByExam(examId);
      if (response.success && response.data) {
        const formattedOptions = response.data.map((room) => ({
          value: room.id,
          label: room.name,
        }));
        setExamRoomList(formattedOptions);
      }
    } catch (error) {
      console.error("Error loading exam rooms:", error);
    }
  }, []);

  const loadSemesterOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    setTimeout(() => {
      callback(
        semesterList.filter((i: any) =>
          i.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }, 1000);
  };

  const loadSubjectOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    setTimeout(() => {
      callback(
        subjectList.filter((i: any) =>
          i.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }, 1000);
  };

  const loadExamRoomOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    setTimeout(() => {
      callback(
        ExamRoomList.filter((i: any) =>
          i.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }, 1000);
  };

  // const onSubmit: SubmitHandler<any> = (data: any) => {
  //   if (data.semester) {
  //     loadSubject(data.semester.value);
  //     setSelectedExamRoom(null)
  //     setSelectedSubject(null)
  //   }
  //   if (data.subject) {
  //     setSelectedExamRoom(null)
  //     loadReports_subject(selectedSemester!.value, data.subject.value)
  //   }
  //   if (data.room) {
  //       setSelectedExamRoom(null)
  //       loadReports_room(selectedSemester!.value, data.room.value)
  //     }
  // };

  const handleExportPDF = () => {
    const waitAnimation = setTimeout(() => {
      generatePDF();
      clearTimeout(waitAnimation);
    }, 1000);
  };

  //// PDF ////

  const setTemporaryDimensions = (
    id: string,
    width: number,
    height: number
  ) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
    }
  };

  const resetDimensions = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.width = "";
      element.style.height = "";
    }
  };

  const captureElementAsImage = async (element: HTMLElement) => {
    const canvas = await html2canvas(element, { scale: 2 });
    return {
      img: canvas.toDataURL("image/png"),
      width: canvas.width,
      height: canvas.height,
    };
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    const PXtoMMratio = 0.109375;

    // Select pie chart and bar chart elements
    const pieChart1Element = document.getElementById("piechart1");
    const pieChart2Element = document.getElementById("piechart2");
    const barChartElement = document.getElementById("barchart");

    setTemporaryDimensions("table-container", 1276, 351); // Lock table size

    // Initialize y-offset for dynamic placement
    let currentYOffset = 40;

    // Add header
    doc.setFont("Roboto-Regular", "normal");
    doc.setFontSize(20);
    doc.text("Báo cáo thống kê", 105, 20, { align: "center" });

    // Capture and add pie chart 1
    let pieChart1WidthMM;
    let pieChart1HeightMM;
    if (pieChart1Element) {
      const pieChart1 = await captureElementAsImage(pieChart1Element);

      pieChart1WidthMM = pieChart1.width * PXtoMMratio;
      pieChart1HeightMM = pieChart1.height * PXtoMMratio;
      // Center and add chart
      doc.addImage(
        pieChart1.img,
        "PNG",
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

      const pieChart2WidthMM = pieChart2.width * PXtoMMratio;
      const pieChart2HeightMM = pieChart2.height * PXtoMMratio;

      // Center and add chart
      doc.addImage(
        pieChart2.img,
        "PNG",
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
        "PNG",
        (210 - barChartWidthMM) / 2,
        currentYOffset,
        barChartWidthMM,
        barChartHeightMM
      );

      currentYOffset += barChartHeightMM + 10;
    }

    // Add table header
    doc.setFontSize(20);
    doc.text("Bảng thống kê số điểm tổng quát", 60, currentYOffset);

    // Add table
    const tableCanvas = await html2canvas(
      document.getElementById("table-container")!,
      { scale: 2 }
    );
    const tableImg = tableCanvas.toDataURL("image/png");
    currentYOffset += 20;

    doc.setFontSize(18);
    doc.addImage(tableImg, "PNG", 10, currentYOffset, 190, 60);

    resetDimensions("table-container");

    // Save PDF
    doc.save("report.pdf");
  };

  useEffect(() => {
    loadSemester();
  }, []);

  return (
    <>
      <div className="report__container">
        <PageTitle theme="light">Tổng quan</PageTitle>
        <div className="report__filter">
          <form className="report__filter-form">
            <div className="report__container-child">
              <p className="report__container-title">Kỳ thi</p>
              <AsyncSelect
                cacheOptions
                loadOptions={loadSemesterOptions}
                defaultOptions={semesterList}
                value={selectedSemester}
                onChange={(value) => {
                  loadSubject(value!.value);
                }}
              />
            </div>
            <div className="report__container-child">
              <p className="report__container-title">Môn thi</p>
              <AsyncSelect
                cacheOptions
                loadOptions={loadSubjectOptions}
                defaultOptions={subjectList}
                onChange={(value) => {
                  loadReports_subject(selectedSemester!.value, value?.value)
                }}
              />
            </div>
            <div className="report__container-child">
              <p className="report__container-title">Phòng thi</p>
              <AsyncSelect
                cacheOptions
                loadOptions={loadExamRoomOptions}
                defaultOptions={ExamRoomList}
                onChange={(value) => {
                  loadReports_room(selectedSemester!.value,value?.value)
                }}
              />
            </div>
          </form>
        </div>
        <div className="report__file">
          <Button className={`report__file-btn `} onClick={handleExportPDF}>
            Xuất file PDF
          </Button>
        </div>
        {touch && singleSemesterData && (
          <div className="report">
            <div className="report__chart2">
              <div className="report__chart-pie">
                <PieChartComponent
                  id="piechart3"
                  title="Tỉ lệ xếp hạng"
                  data={singleSemesterData.semesterScores.distributionOfScores}
                />
              </div>
              <div className="report__chart-pie">
                <PieChartComponent
                  id="piechart4"
                  title="Mức phân bố điểm"
                  data={singleSemesterData.semesterScores.scoreRangePercentage}
                />
              </div>
              {/* <div className="report__chart-bar">
                            <BarChartComponent id="barchnart2" data={APIReturnedReportData.barChartData} />
                        </div> */}
            </div>
            <div className="report__statistic">
              <h2>Bảng thống kê số điểm tổng quát</h2>
              <div id="table-container" className="report__table-container">
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
                    {singleSemesterData.topPerformers.map((semester:any, index:any) => (
                      <tr key={index}>
                        <th scope="row">
                          Thí sinh có điểm số hạng {index + 1} ( tên - điểm )
                        </th>
                        <td>
                          {semester.studentName} - {semester.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {!touch && !singleSemesterData && (
          <>
            <div>
              <h2>
                Hãy chọn kỳ thi, môn thi và phòng thi để hiển thị thông số thống
                kê.
              </h2>
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
