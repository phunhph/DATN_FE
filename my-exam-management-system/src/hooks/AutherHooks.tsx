import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminToken, useClientToken } from "@contexts/AutherContext";

// Utility function for checking token
const checkAndRedirect = (
  tokenRep: string | null,
  expiresAt: Date | null,
  setToken: (token: string | null, data: [] | null, expiresAt: Date | null) => void,
  navigate: (path: string) => void,
  redirectPath: string
) => {
  if (tokenRep && expiresAt) {
    const now = new Date();
    if (now >= expiresAt) {
      // Token expired, clear token and redirect
      setToken(null, null, null);
      navigate(redirectPath);
    }
  } else {
    // Token not found, redirect
    navigate(redirectPath);
  }
};

// Client Auth Hook
export const useClientAuth = () => {
  const { tokenRep, expiresAt, setToken } = useClientToken();
  const navigate = useNavigate();

  useEffect(() => {
    checkAndRedirect(tokenRep, expiresAt, setToken, navigate, "/");
  }, [tokenRep, expiresAt, setToken, navigate]);
};

// Admin Auth Hook
export const useAdminAuth = () => {
  const { tokenRep, expiresAt, setToken } = useAdminToken();
  const navigate = useNavigate();

  useEffect(() => {
    checkAndRedirect(tokenRep, expiresAt, setToken, navigate, "/admin/login");
  }, [tokenRep, expiresAt, setToken, navigate]);
};
