import { MenuLink, DropdownLink } from "@components/index";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./AdminLayout.scss";

const AdminLayout = () => {
  // consts & variables
  // const location = useLocation();
  const [isUserMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<'questions' | 'states' | null>(null);
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const {pathname} = useLocation()
  const isPathExamQuestion = pathname === "/admin/manage-questions" || pathname === "/admin/manage-en-questions";
  const isPathExamState = pathname === "/admin/manage-exam-state-candidates" || pathname === "/admin/manage-exam-state-rooms";
  // functions
  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
  };
  const toggleOpenExamQuestions = () => {
    setOpenMenu(openMenu === 'questions' ? null : 'questions');
  };
  const toggleOpenExamStates = () => {
    setOpenMenu(openMenu === 'states' ? null : 'states');
  };
  const displayLayoutMenu = () => {
    setDisplayMenu(!displayMenu);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setUserMenuOpen(false)
    }
  };
  const removeClassDisplayMenu = () => {
    if (window.innerWidth > 1200) {
      setDisplayMenu(false);
    }
  }
  // effects
  useEffect(() => {
    // close usermenu
    document.addEventListener('click', handleClickOutside)
    // auto remove class display-menu when screen > lg
    window.addEventListener('resize', removeClassDisplayMenu)
    removeClassDisplayMenu()
    // clean up
    return () => {
      document.removeEventListener("click", handleClickOutside)
      window.removeEventListener('resize', removeClassDisplayMenu);
    }
  }, []);
  return (
    <>
      <div className="layout__container">
        <aside className={`layout__menu ${displayMenu ? "display-menu" : ""}`}>
          <div className="menu__logo">
            <NavLink to="/admin" className=""><img src="/logo-black.svg" alt="Easy Exam"></img></NavLink>
            <div className="navbar__menu-toggle">
              <img src="/chevron-left.svg" alt="dash icon" onClick={displayLayoutMenu}></img>
            </div>
          </div>  
          <div className="menu__outer">
            <ul className="menu__list">
              <MenuLink imgSrc="Trang chủ" title="Trang chủ" location=""></MenuLink>
              <MenuLink imgSrc="Quản lý kỳ thi" title="Quản lý kỳ thi" location="manage-semester"></MenuLink>
              <MenuLink imgSrc="Quản lý môn thi" title="Môn thi" location="subject"></MenuLink>
              <MenuLink imgSrc="Quản lý cấu trúc đề" title="Quản lý cấu trúc đề" location="manage-en-exam-structure"/>
              <MenuLink imgSrc="Quản lý phòng thi" title="Quản lý phòng thi" location="manage-exam-rooms"/>
              <MenuLink imgSrc="Quản lý ca thi" title="Quản lý ca thi" location="manage-exam-sessions"/>
              <li className={`menu__item ${openMenu === 'questions' ? "open" : ""} ${isPathExamQuestion ? "activeSM" : ""}`}>
                <div onClick={toggleOpenExamQuestions} className="submenu__btn">
                  <img src="/Câu hỏi thường.svg" alt="menu icon"></img>
                  <span>Quản lý câu hỏi</span>
                </div>
                <ul className="submenu__list">
                  <MenuLink imgSrc="circle" title="Câu hỏi thường" location="manage-questions"/>
                  <MenuLink imgSrc="circle" title="Câu hỏi tiếng Anh" location="manage-en-questions"/>
                </ul>
              </li>
              <MenuLink imgSrc="Quản lý thí sinh" title="Quản lý thí sinh" location="manage-candidates"/>
              <MenuLink imgSrc="Quản lý giám thị" title="Quản lý giám thị" location="manage-supervisors"/>
              <MenuLink imgSrc="Kết quả thi" title="Kết quả thi" location="exam-results"/>
              <MenuLink imgSrc="Quản lý báo cáo" title="Quản lý báo cáo" location="manage-reports"/>
              <MenuLink imgSrc="circle" title="Quản lý trạng thái" location="manage-status"/>
            </ul>
          </div>
        </aside>
        <div className="layout__main" onClick={() => displayMenu ? setDisplayMenu(!displayMenu) : ""}>
          <nav className="navbar">
            <div className="navbar__menu-toggle">
              <img src="/dash-line.svg" alt="dash icon" onClick={displayLayoutMenu}></img>
            </div>
            <div className="navbar__dropdown"  ref={dropDownRef}>
              <div className="dropdown__button" onClick={toggleUserMenu}>
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png" alt="🗿"></img>
                {isUserMenuOpen && (
                  <>
                    <ul className="dropdown__menu">
                      <li className="dropdown__item">
                        <NavLink to={"/admin/user"}>
                          <div className="dropdown__user">
                            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png" alt="🗿"></img>
                            <span>Username</span>
                          </div>
                        </NavLink>
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
          <section className="content-wrapperr">
            <Outlet/>
          </section>
          <footer className="footer">Own by EasyExam © All right reserved</footer>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;  