
import React from 'react';
import "./CandidateAvatarName.scss"
import { CandidatesInformation } from '@interfaces/CandidateInfoInterface/CandidateInfoInterface';

interface CandidateAvatarNameProps {
    candidate: CandidatesInformation;
}

const CandidateAvatarName: React.FC<CandidateAvatarNameProps> = ({ candidate }) => {
    return (
        <div className="candidate__information">
            <div className="candidate__avatar">
                <img src={candidate.image} alt={candidate.name} />
            </div>
            <div className="candidate__name">
                <p>{candidate.name}</p>
            </div>
        </div>
    );
};

export default CandidateAvatarName;
