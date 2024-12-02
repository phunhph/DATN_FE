import { useEffect, useState } from 'react';
import './Slideshow.scss'; // Import file CSS/SCSS cho styling


const Slideshow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        '/image/banner1.png',
        '/image/banner2.png',
        '/image/banner3.png',
      ];
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Chuyển ảnh sau mỗi 3 giây

        return () => {
            clearInterval(interval); // Xóa interval khi component unmount
        };
    }, [images.length]);
    return (
        <div className="slideshow-container">
            {images.map((image, index) => (
                <div key={index} className={`slide ${index === currentIndex ? 'slide-active' : ''}`}>
                    {index === currentIndex && (
                        <img src={image} alt={`Slide ${index}`} className="slide-image" />
                    )}
                </div>
            ))}
            <div className="slide-info">
                <h1>SWIFT EXAM</h1>
                <span>HỆ THỐNG THI TRỰC TUYẾN</span>
                <p>NHANH CHÓNG - DỄ SỬ DỤNG</p>
            </div>

            <div className="dots">
                {images.map((_, index) => (
                    <span key={index} className={`dot ${index === currentIndex ? 'dot-active' : ''}`}></span>
                ))}
            </div>
        </div>
    );
};

export default Slideshow;
