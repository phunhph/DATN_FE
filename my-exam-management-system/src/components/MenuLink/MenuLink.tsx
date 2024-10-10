import { NavLink, useLocation } from "react-router-dom";
import "./MenuLink.scss";

type MenuLinkProps = {
  title: string;
  location: string;
  imgSrc: string;
};

const MenuLink: React.FC<MenuLinkProps> = ({ title, location,imgSrc }) => {
  const { pathname } = useLocation();
  const targetPath = "/admin" + (location ? `/${location}` : "");
  const isActive = pathname === targetPath;
  return (
    <>
      <li className={`menu__item ${isActive ? "active" : ""}`}>
        <NavLink
          to={targetPath}
          className="menu__link"
          end
        >
          <img src={`/${imgSrc}.svg`} alt="menu icon"></img>
          <div>{title}</div>
        </NavLink>
      </li>
    </>
  );
};

export default MenuLink;
