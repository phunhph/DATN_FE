import { NavLink } from "react-router-dom"
import "./DropdownLink.scss"

type DropdownLinkProps = {
  onClick:()=>void;
  title:string;
  location:string;
  imgSrc:string;
}

const DropdownLink:React.FC<DropdownLinkProps> = ({onClick,title,location,imgSrc}) => {
  return (
    <li className="dropdown__item">
    <NavLink className="dropdown__link" to={`/${location}`} onClick={onClick}>
      <img src={`/${imgSrc}`} alt="icon"></img>
      <span>{title}</span>
    </NavLink>
  </li>
  )
}

export default DropdownLink