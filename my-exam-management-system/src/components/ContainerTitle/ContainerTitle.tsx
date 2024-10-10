import React, { ReactNode } from 'react'
import "./ContainerTitle.scss"

type ContainerTitleProps = {
    theme: "light" | "dark";
    className?:string,
    children?: ReactNode
}

const ContainerTitle:React.FC<ContainerTitleProps> = ({theme, className, children, ...props}) => {
  const themeClass = theme === "dark" ? "container--dark" : "container--light";
  return (
    <p className={`container-title ${themeClass}  ${className || ""}`} {...props}>{children}</p>
  )
}

export default ContainerTitle