import { useState, useEffect } from 'react';
import "./CountdownTimer.scss";

type CountdownTimerProps = {
    initialTime: number;
    onTimeChange?: (timeLeft: number) => void;
    freezeTime?: boolean;
    title:string;
};

const CountdownTimer = ({ initialTime, title }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
   
    //timer
    useEffect(() => {
        setTimeLeft(initialTime)
    }, [initialTime]);
    
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
                <p>{title}</p>
                <p>{formatTime(timeLeft)}</p>
            </div>
        </div>
    );
};

export default CountdownTimer;
