// src/App.tsx
import { useAdminAuth } from '@/hooks';
import React, { useEffect } from 'react';

const Welcome: React.FC = () => {
    useAdminAuth();
    
  useEffect(() => {
    document.documentElement.className = `admin-light`;
  }, [])
  
    return (
        <div className="welcome" style={{ height:"100%",display:"flex", justifyContent:"center", alignItems:"center"}}>
            <h1 className="welcom-title" style={{fontSize:"1.25rem"}}>Chào mừng đến với hệ thống quản lý thi Swift Exam!</h1>
        </div>
    );
};

export default Welcome;
