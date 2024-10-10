import { ReactNode } from "react";
import "./ChildContainer.scss"

type ChildContainerProps = {
    theme: "light" | "dark";
    className?:string,
    children?: ReactNode
};

const ChildContainer:React.FC<ChildContainerProps> = ({theme, className, children, ...props}) => {
    const themeClass = theme === "dark" ? "container--dark" : "container--light";
  return (
    <div className={`child-container ${themeClass}  ${className || ""}`} {...props}>
        {children}
    </div>
  )
}

export default ChildContainer