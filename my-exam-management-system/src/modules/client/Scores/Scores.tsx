import { Table } from "@components/index";
import "./Scores.scss";

const Scores = () => {

  //mock API
  const studentScoreList = [
    {
      id: "1",
      semesterCode: "2023S1",
      semesterName: "Spring 2023",
      subjectCode: "MTH101",
      subjectName: "Toán I",
      subjectScore: 85,
      status: "Đạt",
    },
    {
      id: "1",
      semesterCode: "2023S1",
      semesterName: "Spring 2023",
      subjectCode: "ENG102",
      subjectName: "Tiếng Anh",
      subjectScore: 92,
      status: "Đạt",
    },
    {
      id: "2",
      semesterCode: "2023S2",
      semesterName: "Fall 2023",
      subjectCode: "PHY201",
      subjectName: "Vật lý II",
      subjectScore: 78,
      status: "Đạt",
    },
    {
      id: "3",
      semesterCode: "2023S2",
      semesterName: "Fall 2023",
      subjectCode: "CHEM101",
      subjectName: "Hóa học",
      subjectScore: 88,
      status: "Đạt",
    },
    {
      id: "4",
      semesterCode: "2024S1",
      semesterName: "Spring 2024",
      subjectCode: "CS101",
      subjectName: "IT vua của mọi ngành",
      subjectScore: 95,
      status: "Đạt",
    },
    {
      id: "5",
      semesterCode: "2024S1",
      semesterName: "Spring 2024",
      subjectCode: "BIO102",
      subjectName: "Sinh học",
      subjectScore: 80,
      status: "Đạt",
    },
  ];

  const handleStatus = (id: string) => {
    alert(id);
  };

  return (
    <>
      <div>
        <Table
          tableName="Bảng điểm"
          data={studentScoreList}
          action_status={handleStatus}
        ></Table>
      </div>
    </>
  );
};

export default Scores;
