import React, { ReactNode } from "react";
import "./Button.scss";

type ButtonProps = {
  className?: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ className, children, ...props}) => {
  return (
    <button {...props} className={`submit-btn ${className}`}>
      {children}
    </button>
  );
};

export default Button;
