import { MenuLink } from "@components/index";
import { useEffect, useRef, useState } from "react";
import "./AdminLayout.scss";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLayout = () => {
  // consts & variables
  const navigate = useNavigate();
  const [isUserMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement | null>(null);

  // functions
  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
  };
  const displayLayoutMenu = () => {
    setDisplayMenu(!displayMenu);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropDownRef.current &&
      !dropDownRef.current.contains(event.target as Node)
    ) {
      setUserMenuOpen(false);
    }
  };
  const removeClassDisplayMenu = () => {
    if (window.innerWidth > 1200) {
      setDisplayMenu(false);
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
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error);
      localStorage.clear();
      navigate("/");
    }
  };

  // effects
  useEffect(() => {
    // close usermenu
    document.addEventListener("click", handleClickOutside);
    // auto remove class display-menu when screen > lg
    window.addEventListener("resize", removeClassDisplayMenu);
    removeClassDisplayMenu();
    // clean up
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", removeClassDisplayMenu);
    };
  }, []);

  return (
    <>
      <div className="layout__container">
        <aside className={`layout__menu ${displayMenu ? "display-menu" : ""}`}>
          <div className="menu__logo">
            <NavLink to="/admin" className="">
              <img src="/logo-black.svg" alt="Easy Exam"></img>
            </NavLink>
            <div className="navbar__menu-toggle">
              <img
                src="/chevron-left.svg"
                alt="dash icon"
                onClick={displayLayoutMenu}
              ></img>
            </div>
          </div>
          <div className="menu__outer">
            <ul className="menu__list">
              <MenuLink
                imgSrc="Trang chủ"
                title="Trang chủ"
                location=""
              ></MenuLink>
              <MenuLink
                imgSrc="Quản lý kỳ thi"
                title="Quản lý kỳ thi"
                location="manage-semester"
              ></MenuLink>
              <MenuLink
                imgSrc="Quản lý môn thi"
                title="Môn thi"
                location="subject"
              ></MenuLink>
              <MenuLink
                imgSrc="Câu hỏi thường"
                title="Câu hỏi tiếng Anh"
                location="manage-en-questions"
              />
              <MenuLink
                imgSrc="Quản lý cấu trúc đề"
                title="Quản lý cấu trúc đề"
                location="manage-en-exam-structure"
              />
              <MenuLink
                imgSrc="Quản lý thí sinh"
                title="Quản lý thí sinh"
                location="manage-candidates"
              />
              <MenuLink
                imgSrc="Quản lý phòng thi"
                title="Quản lý phòng thi"
                location="manage-exam-rooms"
              />
              <MenuLink
                imgSrc="Quản lý ca thi"
                title="Quản lý ca thi"
                location="manage-exam-sessions"
              />
              <MenuLink
                imgSrc="Kết quả thi"
                title="Kết quả thi"
                location="exam-results"
              />
              <MenuLink
                imgSrc="Quản lý báo cáo"
                title="Quản lý báo cáo"
                location="manage-reports"
              />
              <MenuLink
                imgSrc="circle"
                title="Quản lý trạng thái"
                location="manage-status"
              />
            </ul>
          </div>
        </aside>
        <div
          className="layout__main"
          onClick={() => (displayMenu ? setDisplayMenu(!displayMenu) : "")}
        >
          <nav className="navbar">
            <div className="navbar__menu-toggle">
              <img
                src="/dash-line.svg"
                alt="dash icon"
                onClick={displayLayoutMenu}
              ></img>
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
                        <a>
                          <div className="dropdown__user">
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                              alt="🗿"
                            ></img>
                            <span>Username</span>
                          </div>
                        </a>
                      </li>
                      <div className="dropdown__divider"></div>
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
          <section className="content-wrapperr">
            <Outlet />
          </section>
          <footer className="footer">
            Own by EasyExam © All right reserved
          </footer>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
