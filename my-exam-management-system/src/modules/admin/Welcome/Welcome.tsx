// src/App.tsx
import { useAdminAuth } from '@/hooks';
import React, { useEffect } from 'react';

const Welcome: React.FC = () => {
    useAdminAuth();
    
  useEffect(() => {
    document.documentElement.className = `admin-light`;
  }, [])
  
    return (
        <div>
            <h1>Chào mừng đến với hệ thống quản lý thi!</h1>
        </div>
    );
};

export default Welcome;
