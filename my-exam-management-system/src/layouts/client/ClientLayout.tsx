import { DropdownLink, ToggleSwitch } from "@components/index";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import "./CLientLayout.scss";
import { useTheme } from "@/contexts";
import axios from "axios";

const ClientLayout = () => {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement | null>(null);

  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropDownRef.current &&
      !dropDownRef.current.contains(event.target as Node)
    ) {
      setUserMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "/api/admin/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          baseURL: "https://datn_be.com",
        }
      );

      if (response.data.success) {
        console.log("Đăng xuất thành công");
        localStorage.clear();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error);
      localStorage.clear();
      window.location.href = "/";
    }
  };

  useEffect(() => {
    // close usermenu
    document.addEventListener("click", handleClickOutside);
    // clean up
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="page-content">
        <header className="client-header">
          <nav className="nav">
            <div className="nav__logo">
              <a href={"/client/home"}>
                <img
                  className="nav__logo-img"
                  src="/logo-black.svg"
                  alt="logo"
                ></img>
              </a>
            </div>
            <div className="nav__menu-container">
              <ul className="nav__menu">
                <li className="nav__link">
                  <NavLink
                    to={"/client/home"}
                    className={({ isActive, isPending }) =>
                      ` ${isPending ? "pending" : isActive ? "client-active" : ""
                      } `
                    }
                  >
                    Trang chủ
                  </NavLink>
                </li>
                <li className="nav__link">
                  <NavLink
                    to={"/client/scores"}
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "client-active" : ""
                    }
                  >
                    Bảng điểm
                  </NavLink>
                </li>
                {/* <li className="nav__link">
                  <NavLink to={"/client/history"} className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "client-active" : ""}
                  >Lịch sử thi</NavLink>
                  </li> */}
              </ul>
            </div>
            <div className="navbar__dropdown" ref={dropDownRef}>
              <div className="dropdown__button" onClick={toggleUserMenu}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                  alt="🗿"
                ></img>
                {isUserMenuOpen && (
                  <>
                    <ul className="dropdown__menu">
                      <li className="dropdown__item">
                        <NavLink to={"/client/candidate-information"}>
                          <div className="dropdown__user">
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                              alt="🗿"
                            ></img>
                            <span>Username</span>
                          </div>
                        </NavLink>
                      </li>
                      <div className="dropdown__divider"></div>
                      <div className="show-responsive-nav">
                        <DropdownLink
                          location="client/scores"
                          onClick={toggleUserMenu}
                          title="Bảng điểm"
                        ></DropdownLink>
                        {/* <DropdownLink location="client/history" onClick={toggleUserMenu} title="Lịch sử thi"></DropdownLink> */}
                      </div>
                      {/* <DropdownLink location="settings" onClick={toggleUserMenu} title="Cài đặt"></DropdownLink> */}
                      {/* <li className="dropdown__item">
                          <ToggleSwitch className="nav__toggle" id="" toggleState={theme == "light" ? false : true} onToggle={toggleTheme}></ToggleSwitch><span>Nền {theme == 'light' ? "Sáng" : "Tối"}</span>
                        </li> */}
                      {/* <div className="dropdown__divider"></div> */}
                      <li className="dropdown__button" onClick={toggleUserMenu}>
                        <NavLink
                          to="/"
                          className="dropdown__logout"
                          onClick={handleLogout}
                        >
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
              <img
                className="client-footer__logo"
                src="/logo-black.svg"
                alt="logo"
              ></img>
              <ul className="client-footer__list">
                <li>
                  <span style={{ fontWeight: "bold" }}>ĐỊA CHỈ</span>
                  <p>Cổng số 1, Tòa nhà FPT Polytechnic, 13 phố Trịnh Văn Bô, phường Phương Canh, quận Nam Từ Liêm, TP Hà Nội
                    Km12 Cầu Diễn, Phường Phúc Diễn, Quận Bắc Từ Liêm, Hà Nội</p>
                </li>
                <li style={{marginTop:"2rem"}}>
                  <span style={{ fontWeight: "bold" }}>LIÊN HỆ</span>
                  <p>Số điện thoại: 091 234 5678</p>
                  <p>Email: swift.exam@gmail.com</p>
                </li>
              </ul>
            </div>
            <div className="client-footer__link">
              <p>LINK</p>
              <ul className="client-footer__list">
                <li>
                  <Link to="/client/home">Trang chủ</Link>
                </li>
                <li>
                  <Link to="/client/scores">Bảng điểm</Link>
                </li>
                {/* <li><Link to="/client/history">Lịch sử thi</Link></li> */}
                <li>
                  <Link to=""></Link>
                </li>
                <li>
                  <Link to=""></Link>
                </li>
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
