import React from "react";
import "./PageTitle.scss";
type PageTitleProps = {
  children?: React.ReactNode;
  className?: string;
  theme?: "light" | "dark";
};

const PageTitle: React.FC<PageTitleProps> = ({ children, className, theme }) => {
  const themeClass = theme === "dark" ? "title--dark" : "title--light";
  return (
    <div className="title__container">
      <h1 className={`defaultH1 ${themeClass}  ${className || ""}`}>{children}</h1>
    </div>
  );
};

export default PageTitle;
