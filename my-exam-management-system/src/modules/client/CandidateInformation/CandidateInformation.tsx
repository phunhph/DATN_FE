import React, { useEffect, useRef, useState } from 'react';
import "./CandidateInformation.scss";
import { CandidatesInformation } from '@interfaces/CandidateInfoInterface/CandidateInfoInterface';
import useDebounce from '@/hooks/useDebounce';
import { Notification } from '@/components';

const CandidateInformation = () => {
    const [candidate, setCandidate] = useState<CandidatesInformation | null>(null);

    //thông bóa
    const [notifications, setNotifications] = useState<Array<{ message: string; isSuccess: boolean }>>([]);

    const addNotification = (message: string, isSuccess: boolean) => {
        setNotifications((prev) => [...prev, { message, isSuccess }]);
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const handleImageUpload = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log(e)
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCandidate((prevCandidate) => prevCandidate ? { ...prevCandidate, image: reader.result as string } : null);
            };
            reader.readAsDataURL(file);

            // api upload

            //thành công:
            // addNotification("Tải ảnh lên thành công.", true)

            //thất bại:
            // addNotification("Tải ảnh lên không thành công. Xin vui lòng thử lại sau.", false)
        }
    }, 500)

    useEffect(() => {
        //api
        setCandidate({
            id: 1,
            masv: "PH11111",
            name: "Nguyễn Văn A",
            dob: "2004-12-09",
            address: "141 Nguyễn Thái Học, quận Ba Đình, Hà Nội",
            email: "anvph11111@gmail.com",
            image: "https://mcdn.coolmate.me/image/July2023/gigachad-la-ai-2138_928.jpg"
        })
    }, [])

    return (


        <div className="candidate__container">
            <div className="candidate__avatar-wrapper">
                <label htmlFor='avatar' className="candidate__avatar-wrapper-label">
                    <input
                        id="avatar"
                        name="avatar"
                        className="candidate__avatar-wrapper-input"
                        type="file"
                        accept="image/*"
                        multiple={false}
                        onChange={handleImageUpload}
                    >
                    </input>
                    <div className="candidate__avatar-wrapper-image">
                        {candidate ?
                            <img src={candidate.image} alt={candidate.name} ></img>
                            : <img src="https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg" alt="Tạm thời không có ảnh"></img>
                        }
                        <div>
                            <p>Tải ảnh lên</p>
                        </div>
                    </div>
                </label>
                <div className="candidate__avatar-wrapper-base-info">
                    <p>@{candidate?.masv}</p>
                </div>
            </div>
            <div className="candidate__information-wrapper">
                <h1>Thông tin cơ bản</h1>

                <form>
                    <div>
                        <label>Họ và tên:
                            <input type='text' defaultValue={candidate?.name}></input>
                        </label>
                        <label>Email:
                            <input type='text' defaultValue={candidate?.email}></input>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="date">Ngày sinh:
                            <input
                                id="date"
                                type="date"
                                defaultValue={candidate?.dob}
                            />
                        </label>
                        <label>Địa chỉ:
                            <input type='text' defaultValue={candidate?.address}></input>
                        </label>
                    </div>
                </form>
            </div>
            <Notification
                notifications={notifications}
                clearNotifications={clearNotifications}
            />
        </div>
    );
}

export default CandidateInformation;
