import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Notification } from "../../components";
import "./login.scss";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);

  const navigate = useNavigate();
  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };



  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let valid = true;
    setEmailError(null);
    setPasswordError(null);

    if (email.trim() === "") {
      setEmailError("Vui lòng nhập tài khoản");
      valid = false;
    }
    if (password.trim() === "") {
      setPasswordError("Vui lòng nhập mật khẩu");
      valid = false;
    }

    if (valid) {
      addNotification('login success', true);
    }
  };

  const handleForgotPassword = () => {
    alert("Redirect to forgot password page");
  };


  useEffect(() => {
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Hệ thống quản trị</h1>
        <p>Vui lòng nhập thông tin</p>
        <form className="form-login" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Tài khoản</label>
            <input
              type="text"
              id="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập tài khoản"
            />
            <br />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
            />
            <br />
            {passwordError && (
              <span className="error-message">{passwordError}</span>
            )}
          </div>
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Nhớ mật khẩu</label>
            </div>
            <div className="forgot-password" onClick={handleForgotPassword}>
              Quên mật khẩu?
            </div>
          </div>
          <button type="submit" className="submit-btn">
            Đăng nhập
          </button>
        </form>

      </div>
      <Notification
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
    </div>

  );
};

export default Login;
