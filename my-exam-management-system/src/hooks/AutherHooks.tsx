import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "@contexts/AutherContext";

const useAuth = () => {
  const { tokenRep, expiresAt, setToken } = useToken();
  const navigate = useNavigate();
  const checkToken = () => {
    if (tokenRep && expiresAt) {
      const now = new Date();
      if (now < expiresAt) {
        return;
      } else {
        setToken(null, null, null);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };
  useEffect(() => {
    checkToken();
  }, [tokenRep, expiresAt, navigate, setToken]);
};

export default useAuth;
