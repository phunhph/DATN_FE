import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

// Types for context
interface TokenContextType {
  tokenRep: string | null;
  data: [] | null;
  expiresAt: Date | null;
  setToken: (tokenRep: string | null, data: [] | null, expiresAt: Date | null) => void;
}

// Admin Token Context
const AdminTokenContext = createContext<TokenContextType | undefined>(undefined);

// Client Token Context
const ClientTokenContext = createContext<TokenContextType | undefined>(undefined);

// Provider for Admin Token
const AdminTokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tokenRep, setTokenState] = useState<string | null>(localStorage.getItem('adminToken'));
  const [data, setData] = useState<[] | null>(JSON.parse(localStorage.getItem('adminData') || 'null'));
  const [expiresAt, setExpiresAt] = useState<Date | null>(
    localStorage.getItem('adminExpiresAt') ? new Date(localStorage.getItem('adminExpiresAt') as string) : null
  );

  useEffect(() => {
    if (tokenRep && expiresAt) {
      localStorage.setItem('adminToken', tokenRep);
      localStorage.setItem('adminData', JSON.stringify(data));
      localStorage.setItem('adminExpiresAt', expiresAt.toISOString());
    } else {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      localStorage.removeItem('adminExpiresAt');
    }
  }, [tokenRep, data, expiresAt]);

  const setToken = (token: string | null, data: [] | null, expiresAt: Date | null) => {
    setTokenState(token);
    setData(data);
    setExpiresAt(expiresAt);
  };

  return (
    <AdminTokenContext.Provider value={{ tokenRep, data, expiresAt, setToken }}>
      {children}
    </AdminTokenContext.Provider>
  );
};

// Provider for Client Token
const ClientTokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tokenRep, setTokenState] = useState<string | null>(localStorage.getItem('clientToken'));
  const [data, setData] = useState<[] | null>(JSON.parse(localStorage.getItem('clientData') || 'null'));
  const [expiresAt, setExpiresAt] = useState<Date | null>(
    localStorage.getItem('clientExpiresAt') ? new Date(localStorage.getItem('clientExpiresAt') as string) : null
  );

  useEffect(() => {
    if (tokenRep && expiresAt) {
      localStorage.setItem('clientToken', tokenRep);
      localStorage.setItem('clientData', JSON.stringify(data));
      localStorage.setItem('clientExpiresAt', expiresAt.toISOString());
    } else {
      localStorage.removeItem('clientToken');
      localStorage.removeItem('clientData');
      localStorage.removeItem('clientExpiresAt');
    }
  }, [tokenRep, data, expiresAt]);

  const setToken = (token: string | null, data: [] | null, expiresAt: Date | null) => {
    setTokenState(token);
    setData(data);
    setExpiresAt(expiresAt);
  };

  return (
    <ClientTokenContext.Provider value={{ tokenRep, data, expiresAt, setToken }}>
      {children}
    </ClientTokenContext.Provider>
  );
};

// Hooks for Admin Token
const useAdminToken = (): TokenContextType => {
  const context = useContext(AdminTokenContext);
  if (!context) {
    throw new Error('useAdminToken must be used within an AdminTokenProvider');
  }
  return context;
};

// Hooks for Client Token
const useClientToken = (): TokenContextType => {
  const context = useContext(ClientTokenContext);
  if (!context) {
    throw new Error('useClientToken must be used within a ClientTokenProvider');
  }
  return context;
};

export { AdminTokenProvider, ClientTokenProvider, useAdminToken, useClientToken };
