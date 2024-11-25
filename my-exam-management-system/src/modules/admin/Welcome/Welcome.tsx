// src/App.tsx
import { useAdminAuth } from '@/hooks';
import React from 'react';

const Welcome: React.FC = () => {
    useAdminAuth();
    return (
        <div>
            <h1>Chào mừng đến với hệ thống quản lý thi!</h1>
        </div>
    );
};

export default Welcome;
