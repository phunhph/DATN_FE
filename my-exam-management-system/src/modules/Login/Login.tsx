/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import { login, loginClient } from "@/services/repositories/AutherService/autherService";
import { useClientToken } from "@/contexts";
import { Notification } from "@/components";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { tokenRep, expiresAt, setToken } = useClientToken();
  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);
  const [loading, setLoading] = useState(false); // New loading state

  const navigate = useNavigate();
  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const loginServices = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await loginClient(email, password);
      if (user.status !== 200) {
        addNotification(user.warning, user.success);
      } else {
        const { token, data, expires_at } = user;
        console.log(user);
        
        setToken(token, data, new Date(expires_at * 1000));
        const data_ = {
          token: user.token,
          expires_at: user.expires_at,
        };
        localStorage.setItem("token_client", JSON.stringify(data_));
        localStorage.setItem("data_client", JSON.stringify(user.data));
        navigate("/client");
      }
    } catch (error) {
      addNotification("Đăng nhập thất bại, vui lòng thử lại.", false);
    } finally {
      setLoading(false);
    }
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
      loginServices(email, password);
    }
  };

  const handleForgotPassword = () => {
    alert("Redirect to forgot password page");
  };

  const checkToken = () => {
    if (tokenRep && expiresAt) {
      const now = new Date();
      if (now < expiresAt) {
        navigate("/client");
      } else {
        setToken(null, null, null);
      }
    }
  };

  useEffect(() => {
    checkToken();
  }, [navigate, tokenRep, expiresAt, setToken]);

  return (
    <div className="login-container">
      <div className="content_Login">
        <div className="left">
          <div className="logo">EASY EXAM</div>
          <h1>Chào mừng đến với EASY EXAM!</h1>
          <p>Thi trắc nghiệm online, một người thi cả lớp 10 điểm!</p>
          <div className="video-placeholder">
            <button className="play-button">▶</button>
          </div>
          <p>Xem video để biết thêm thông tin!</p>
        </div>
        <div className="right">
          <h2>ĐĂNG NHẬP</h2>
          <p>Đăng nhập để làm bài thi ngay!</p>
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
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>

      <Notification
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
    </div>
  );
};

export default Login;
