import { SubmitHandler, useForm } from "react-hook-form"
import "./Login.scss"
import { Button, validation } from "@components/index";
import { NavLink, useNavigate } from "react-router-dom";
import { useNotification, useToken } from "@contexts/index";
import { useEffect } from "react";
const Login = () => {
  const nav = useNavigate()
  const { tokenRep, expiresAt, setToken } = useToken();
  const {notify} = useNotification()

  type LoginFormValue = {
    email: string;
    password: string;
  }

  const {
    handleSubmit,
    formState : {errors},
    register,
    setValue
  } = useForm<LoginFormValue>({})

  const onSubmit:SubmitHandler<LoginFormValue> = (data:LoginFormValue) => {
    console.log(data)
    //api login thành công
    if (true) {
      setToken('tokenSample', [], new Date(1 * 1000));
      nav("/home")
    } else {
      notify("Error","Tài khoản không tồn tại hoặc sai mật khẩu.")
    }
  }
  const checkToken = () => {
    if (tokenRep && expiresAt) {
      const now = new Date();
      if (now < expiresAt) {
        nav('/home');
      } else {
        setToken(null, null, null);
      }
    }
  };
  useEffect(() => {
    checkToken();
  }, [nav, tokenRep, expiresAt, setToken]);

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__left">
          <div className="login__left-inner">
            <img className="login__logo" src="/logo-black.svg" alt="logo"></img>
            <h2 className="login__title">Chào mừng đến với Swift Exam!</h2>
            <p>Thi thật dễ - Kết quả lập tức</p>
            <iframe className="login__video"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?&autoplay=1&mute=1" 
              title="Rick Astley - Never Gonna Give You Up" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
        <div className="vertical-divider"></div>
        <div className="login__right">
          <h2 className="login__title uppercase">Đăng nhập</h2>
          <p>Đăng nhập nhanh chóng, làm bài thi ngay</p>
          <form onSubmit={handleSubmit(onSubmit)} className="login__form">
            <div className="login__form-group">
              <label htmlFor="email" className="login__form-label">Email</label>
              <input id="email" type="text" className="login__form-input" {...register('email',validation.email)} onBlur={(e) => setValue('email', e.target.value.trim())}></input>
              <div className="login__form-error">
                {errors.email ? <span className="login__form-message">{errors.email.message}</span> : ''}
              </div>
            </div>
            <div className="login__form-group">
              <label htmlFor="password" className="login__form-label">Mật khẩu</label>
              <input id="password" type="password" className="login__form-input" {...register('password',validation.password)} onBlur={(e) => setValue('password', e.target.value.trim())}></input>
              <div className="login__form-error">
                {errors.password ? <span className="login__form-message">{errors.password.message}</span> : ''}
              </div>
            </div>
            <Button type="submit" className="login__form-submit">Đăng nhập</Button>
          </form>
          <NavLink to={'/findme'} className="login__findme">Quên mật khẩu</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Login