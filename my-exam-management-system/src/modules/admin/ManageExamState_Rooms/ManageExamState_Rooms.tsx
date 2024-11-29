// src/App.tsx
import React, { useEffect } from 'react';

const ManageExamState_Rooms: React.FC = () => {
    
  useEffect(() => {
    document.documentElement.className = `admin-light`;
  }, [])
  
    return (
        <div>
            <h1>Chào mừng đến với hệ thống quản lý thi!</h1>
        </div>
    );
};

export default ManageExamState_Rooms;
