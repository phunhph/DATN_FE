import { useState } from 'react';
import './DetailedResult.scss';
import { RedirectButton } from '@components/index';
import { Table } from '@components/Table/Table';
import { CandidatesInformation } from '@interfaces/CandidateInfoInterface/CandidateInfoInterface';



type Props = {};

const DetailedResult = (props: Props) => {
    const [candidates] = useState<CandidatesInformation[]>([
        {
            id: 1,
            masv: "PH11111",
            name: "Nguyễn Văn A",
            dob: "2004-12-09",
            address: "Hà Nội",
            email: "anvph11111@gmail.com",
            image: "https://i.pinimg.com/736x/bb/e3/02/bbe302ed8d905165577c638e908cec76.jpg"
        }
    ]);
    const informationFake = [
        {
            id: 1,
            start: "2024-10-25 10:00:00",
            end: "2024-10-25 11:00:00",
            correctAnswer: 25,
            total: "9/10",
        }
    ]
    const answer=[
        {
            questionNumber:1,
            yourAnswer: "A",
            correctAnswer:"B"
        },
        {
            questionNumber:2,
            yourAnswer: "c",
            correctAnswer:"C"
        }
    ]
    const combinedData = candidates.map((candidate, index) => ({
        masv: candidate.masv,
        name: candidate.name,
        start: informationFake[index]?.start || '',
        end: informationFake[index]?.end || '',
        correctAnswer: informationFake[index]?.correctAnswer || '',
        total: informationFake[index]?.total || ''
    }));
    return (
        <div className='detailedResult__container'>
            <div className="detailedResult__title">
                <h1>Chi tiết kết quả bài thi</h1>
            </div>
            <div className="button__another">
                <RedirectButton to="/exam" label="Làm bài thi" />
            </div>
            <div className="detailedResult__table">
                <Table
                    tableName='Thông tin tổng quan'
                    data={combinedData }
                ></Table>
            </div>
            <div className="detailedResult__answer">
                <Table
                tableName='Kết quả bài thi'
                data={answer}
                ></Table>
            </div>
        </div>
    );
};

export default DetailedResult;
