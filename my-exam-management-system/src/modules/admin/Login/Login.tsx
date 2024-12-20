/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Notification } from "@/components";
import "./login.scss";
import { login } from "@/services/repositories/AutherService/autherService";
import { useAdminToken } from "@/contexts";

const LoginAdmin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { tokenRep, expiresAt, setToken } = useAdminToken();
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
      const user = await login(email, password);
      if (user.status !== 200) {
        addNotification(user.warning, user.success);
      } else {
        const { token, data, expires_at } = user;
        setToken(token, data, new Date(expires_at * 1000));
        const data_ = {
          token: user.token,
          expires_at: user.expires_at,
        };
        localStorage.setItem("token", JSON.stringify(data_));
        localStorage.setItem("data", JSON.stringify(user.data));
        navigate("/admin");
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
        navigate("/admin");
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
              style={{width:"100%"}}
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
              style={{width:"100%"}}
            />
            {passwordError && (
              <span className="error-message">{passwordError}</span>
            )}
          </div>
          {/* <div className="form-options">
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
          </div> */}
          <Button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
          </Button>
        </form>
      </div>
      <Notification
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
    </div>
  );
};

export default LoginAdmin;
