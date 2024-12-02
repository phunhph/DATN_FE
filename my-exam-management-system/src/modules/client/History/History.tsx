import { Table } from "@components/index";
import "./History.scss";
const History = () => {
  const studentExamHistory = [
    {
      id: "1",
      semesterCode: "2023S1",
      semesterName: "Spring 2023",
      subjectCode: "MTH101",
      subjectName: "Toán I",
      subjectScore: 85,
      detail: "Đạt",
    },
    {
      id: "1",
      semesterCode: "2023S1",
      semesterName: "Spring 2023",
      subjectCode: "ENG102",
      subjectName: "Tiếng Anh",
      subjectScore: 92,
      detail: "Đạt",
    },
    {
      id: "2",
      semesterCode: "2023S2",
      semesterName: "Fall 2023",
      subjectCode: "PHY201",
      subjectName: "Vật lý II",
      subjectScore: 78,
      detail: "Đạt",
    },
    {
      id: "3",
      semesterCode: "2023S2",
      semesterName: "Fall 2023",
      subjectCode: "CHEM101",
      subjectName: "Hóa học",
      subjectScore: 88,
      detail: "Đạt",
    },
    {
      id: "4",
      semesterCode: "2024S1",
      semesterName: "Spring 2024",
      subjectCode: "CS101",
      subjectName: "IT vua của mọi ngành",
      subjectScore: 95,
      detail: "Đạt",
    },
    {
      id: "5",
      semesterCode: "2024S1",
      semesterName: "Spring 2024",
      subjectCode: "BIO102",
      subjectName: "Sinh học",
      subjectScore: 80,
    },
  ];
  const handleDetail = (id: string) => {
    console.log(id);
  };

  const title = [
    "STT",
    "Mã kỳ thi",
    "Kỳ thi",
    "Mã môn thi",
    "Môn thi",
    "Điểm số",
    "Đánh giá",
    "Thao tác"
  ];

  return (
    <>
      <div>
        <Table
          title={title}
          tableName="Lịch sử thi"
          data={studentExamHistory}
          actions_detail={handleDetail}
        ></Table>
      </div>
    </>
  );
};

export default History;
