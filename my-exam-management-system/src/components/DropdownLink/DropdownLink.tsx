import { NavLink } from "react-router-dom"
import "./DropdownLink.scss"

type DropdownLinkProps = {
  onClick:()=>void;
  title:string;
  location:string;
}

const DropdownLink:React.FC<DropdownLinkProps> = ({onClick,title,location}) => {
  return (
    <li className="dropdown__item">
    <NavLink className="dropdown__link" to={`/${location}`} onClick={onClick}>
      <span>{title}</span>
    </NavLink>
  </li>
  )
}

export default DropdownLink