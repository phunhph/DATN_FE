
import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./PageTitle.scss";

type PageTitleProps = {
  children?: React.ReactNode;
  className?: string;
  theme?: "light" | "dark";
  showBack?: boolean; 
};

const PageTitle: React.FC<PageTitleProps> = ({
  children,
  className,
  theme,
  showBack = false, 
}) => {
  const themeClass = theme === "dark" ? "title--dark" : "title--light";
  const navigate = useNavigate(); 

  const handleBackClick = () => {
    navigate(-1); 
  };

  return (
    <div className="title__container">
      <h1 className={`defaultH1 ${themeClass} ${className || ""}`}>
        {children}
      </h1>
      {showBack && ( 
        <button className="back" onClick={handleBackClick}>
          <img src="/Back.svg" alt="Back" />
        </button>
      )}
    </div>
  );
};

export default PageTitle;
