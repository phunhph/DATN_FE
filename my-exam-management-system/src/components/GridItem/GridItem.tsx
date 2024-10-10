import { ReactNode } from "react";
import "./GridItem.scss";

type GridItemProps = {
  children?: ReactNode;
  className?: string;
};

const GridItem: React.FC<GridItemProps> = ({ children, className, ...props }) => {
  return (
    <div className={`grid__item ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

export default GridItem;