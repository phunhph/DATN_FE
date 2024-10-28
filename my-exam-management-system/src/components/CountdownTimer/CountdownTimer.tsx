
import { useState, useEffect } from 'react';
import "./CountdownTimer.scss"

type CountdownTimerProps = {
    initialTime: number;
};

const CountdownTimer = ({ initialTime }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    return (
        <div className="countdown__container">
            <div className="countdown__timer">
                <p>Thời gian còn lại</p>
                <p>{formatTime(timeLeft)}</p>
            </div>
        </div>
    );
};

export default CountdownTimer;
