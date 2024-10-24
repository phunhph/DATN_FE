import { DropdownLink } from "@components/index";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import "./CLientLayout.scss";

const ClientLayout = () => {
  const [isUserMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement | null>(null);

  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setUserMenuOpen(false)
    }
  };
  
  useEffect(() => {
    // close usermenu
    document.addEventListener('click', handleClickOutside)
    // clean up
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, []);

  return (
    <>
      <div className="page-content">
        <header className="header">
          <nav className="nav">
            <div className="nav__logo">
              <NavLink to={"/client/home"} ><img className="nav__logo-img" src="/logo-black.svg" alt="logo"></img></NavLink>
            </div>
            <div className="nav__menu-container">
              <ul className="nav__menu">
                <li className="nav__link">
                  <NavLink to={"/client/home"} className={({ isActive, isPending }) =>` ${isPending ? "pending" : isActive ? "client-active" : ""} `}
                  >Trang chủ</NavLink>
                </li>
                <li className="nav__link">
                  <NavLink to={"/client/scores"} className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "client-active" : ""}
                  >Bảng điểm</NavLink>
                </li>
                <li className="nav__link">
                  <NavLink to={"/client/history"} className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "client-active" : ""}
                  >Lịch sử thi</NavLink>
                  </li>
              </ul>
            </div>
            <div className="navbar__dropdown"  ref={dropDownRef}>
                <div className="dropdown__button" onClick={toggleUserMenu}>
                  <img src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png" alt="🗿"></img>
                  {isUserMenuOpen && (
                    <>
                      <ul className="dropdown__menu">
                        <li className="dropdown__item">
                          <div className="dropdown__user">
                            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png" alt="🗿"></img>
                            <span>Username</span>
                          </div>
                        </li>
                        <div className="dropdown__divider"></div>
                        <DropdownLink imgSrc="settings.svg" location="settings" onClick={toggleUserMenu} title="Cài đặt"></DropdownLink>
                        <div className="dropdown__divider"></div>
                        <li className="dropdown__button" onClick={toggleUserMenu}>
                          <NavLink  to="/" className="dropdown__logout">
                            <small>Đăng xuất</small>
                            <img src="/log-out.svg" alt="icon"></img>
                          </NavLink>
                          </li>
                      </ul>
                    </>
                  )}
                </div>
              </div>  
          </nav>
        </header>
        <div className="divider"></div>
        <div className="content-wrapper">
          <Outlet />
        </div>
        <footer className="client-footer">
          <div className="client-footer__info">
            <div className="footer__contact">
              <img className="client-footer__logo" src="/logo-black.svg" alt="logo"></img>
              <ul className="client-footer__list">
                <li>Email : swift.exam@gmail.com</li>
                <li>Địa chỉ : số 2 cạnh nhà hàng xóm, Hà Nội, Việt Nam</li>
                <li>Liên hệ: 091 234 5678</li>
              </ul>
            </div>
            <div className="client-footer__link">
              <p>Link</p>
              <ul className="client-footer__list">
                <li><Link to="/client/home">Trang chủ</Link></li>
                <li><Link to="/client/scores">Bảng điểm</Link></li>
                <li><Link to="/client/history">Lịch sử thi</Link></li>
                <li><Link to=""></Link></li>
                <li><Link to=""></Link></li>
              </ul>
            </div>
          </div>
          <div className="client-footer__end">
            <span>©2024 Swift Exam. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ClientLayout;