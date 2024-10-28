import React, { useState } from 'react';
import "./CandidateInformation.scss";
import { CandidatesInformation } from '@interfaces/CandidateInfoInterface/CandidateInfoInterface';

type Props = {}

const CandidateInformation = (props: Props) => {
    const [candidates, setCandidates] = useState<CandidatesInformation[]>([
        {
            id: 1,
            masv: "PH11111",
            name: "Nguyễn Văn A",
            dob: "2004 - 12 - 09",
            address: "Hà Nội",
            email: "anvph11111@gmail.com",
            image: "https://i.pinimg.com/736x/bb/e3/02/bbe302ed8d905165577c638e908cec76.jpg"
        }
    ]);

    const [hoveredCandidateId, setHoveredCandidateId] = useState<number | null>(null);

    const cropImageToSquare = (url: string, callback: (croppedImage: string) => void) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const minSize = Math.min(img.width, img.height);
            const offsetX = (img.width - minSize) / 2;
            const offsetY = (img.height - minSize) / 2;
            canvas.width = minSize;
            canvas.height = minSize;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(img, offsetX, offsetY, minSize, minSize, 0, 0, minSize, minSize);
                const croppedImage = canvas.toDataURL('image/png');
                callback(croppedImage);
            }
        };
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, candidateId: number) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    cropImageToSquare(reader.result as string, (croppedImage) => {
                        const updatedCandidates = candidates.map(candidate =>
                            candidate.id === candidateId ? { ...candidate, image: croppedImage } : candidate
                        );
                        setCandidates(updatedCandidates);
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='information__container'>
            <div className="information__title">
                <h1>Thông tin thí sinh</h1>
            </div>
            {candidates.map((candidate) => (
                <div key={candidate.id} className="detail__item">
                    <div
                        className="detail__avatar"
                        onMouseEnter={() => setHoveredCandidateId(candidate.id)}
                        onMouseLeave={() => setHoveredCandidateId(null)}
                    >
                        <img src={candidate.image} alt={`Avatar của ${candidate.name}`} />
                        <div className="overlay">
                            {hoveredCandidateId === candidate.id && (
                                <button
                                    className="change-image-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById(`upload-${candidate.id}`)?.click();
                                    }}
                                >
                                    Tải ảnh đại diện
                                </button>
                            )}
                        </div>
                        <input
                            id={`upload-${candidate.id}`}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageUpload(e, candidate.id)}
                        />
                    </div>
                    <div className="detail__info">
                        <p>Mã SV: {candidate.masv}</p>
                        <p>Tên: {candidate.name}</p>
                        <p>Ngày sinh: {candidate.dob}</p>
                        <p>Địa chỉ: {candidate.address}</p>
                        <p>Email: {candidate.email}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CandidateInformation;
