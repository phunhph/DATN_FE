import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

interface TokenContextType {
    tokenRep:string| null;
    data:[]| null;
    expiresAt:Date| null;
  setToken: (tokenRep: string| null, data: []| null, expiresAt: Date| null) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tokenRep, setTokenState] = useState<string | null>(localStorage.getItem('token'));
    const [data, setData] = useState<[] | null>(JSON.parse(localStorage.getItem('data') || 'null'));
    const [expiresAt, setExpiresAt] = useState<Date | null>(localStorage.getItem('expiresAt') ? new Date(localStorage.getItem('expiresAt') as string) : null);
    useEffect(() => {
        if (tokenRep && expiresAt) {
          localStorage.setItem('token', tokenRep);
          localStorage.setItem('data', JSON.stringify(data));
          localStorage.setItem('expiresAt', expiresAt.toISOString());
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('data');
          localStorage.removeItem('expiresAt');
        }
      }, [tokenRep, data, expiresAt]);
  const setToken = (token: string| null, data: []| null, expiresAt: Date| null ) => {
    setTokenState(token);
    setData(data);
    setExpiresAt(expiresAt);
  };

  return (
    <TokenContext.Provider value={{ tokenRep, data, expiresAt, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

const useToken = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};

export { TokenProvider, useToken };
