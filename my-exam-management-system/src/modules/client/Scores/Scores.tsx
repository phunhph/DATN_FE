import { Table } from "@components/index";
import "./Scores.scss";
import { useEffect, useState } from "react";
import { getScoreboard } from "@/services/repositories/scoreboard/scoreboardServices";
import { ApiScoreBoardResponse } from "@/interfaces/SemesterInterface/SemestertInterface";

const Scores = () => {
  
  //mock API
  interface Score {
    id: string,
    semesterCode: string,
    semesterName: string,
    subjectCode: string,
    subjectName: string,
    subjectScore: number,
    result: string,
  }

  const [studentScoreList, setStudentScoreList] = useState<Score[]>([]);

  const getScores = async (id: string) => {
    const result = await getScoreboard(id);

    if (result.success && result.data.length > 0) {
        format(result);
    } else {
        console.error(result.message);
    }
};


  const format = (score: ApiScoreBoardResponse) => {
    const result: Score[] = [];
    score.data.map((e) => {
      const data: Score = {
        id: e.exam_id,
        semesterCode: e.exam_id,
        semesterName: e.exam_name,
        subjectCode: e.subject_id,
        subjectName: e.subject_name,
        subjectScore: e.point,
        result: e.point >= 5 ? 'Đạt' : 'Không Đạt'

      }
      result.push(data)
    })

    setStudentScoreList(result)
  }

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("clientData") || "{}");
    getScores(data.idcode);
  }, []);
  const handleresult = (id: string) => {
    alert(id);
  };

  const title = [
    "STT",
    "Mã kỳ thi",
    "Kỳ thi",
    "Mã môn thi",
    "Môn thi",
    "Điểm số",
    "Đánh giá",
  ];

  return (
    <>
      <div>
        <Table
          title={title}
          tableName="Bảng điểm"
          data={studentScoreList}
        // action_result={handleresult}

        ></Table>
      </div>
    </>
  );
};

export default Scores;
