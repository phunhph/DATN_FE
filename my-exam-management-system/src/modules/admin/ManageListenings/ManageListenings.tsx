// src/App.tsx
import React, { useEffect } from 'react';

const ManageListenings: React.FC = () => {
    
  useEffect(() => {
    document.documentElement.className = `admin-light`;
  }, [])
  
    return (
        <div>
            <h1>Chào mừng đến với hệ thống quản lý thi!</h1>
        </div>
    );
};

export default ManageListenings;
