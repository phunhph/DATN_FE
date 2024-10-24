import React, { useState, useEffect } from 'react';
import './Slideshow.scss'; // Import file CSS/SCSS cho styling

interface SlideshowProps {
    images: string[];
}

const Slideshow: React.FC<SlideshowProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Chuyển ảnh sau mỗi 3 giây

        return () => {
            clearInterval(interval); // Xóa interval khi component unmount
        };
    }, [images.length]);

    return (
        <div className="slideshow-container">
            {images.map((image, index) => (
                <div
                    className={`slide ${index === currentIndex ? 'active' : ''}`}
                    key={index}
                >
                    {index === currentIndex && (
                        <img src={image} alt={`Slide ${index}`} className="slide-image" />
                    )}
                </div>
            ))}
            <div className="dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Slideshow;
