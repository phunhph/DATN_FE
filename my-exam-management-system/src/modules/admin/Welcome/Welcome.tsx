// src/App.tsx
import { useAuth } from '@/hooks';
import React from 'react';

const Welcome: React.FC = () => {
    useAuth();
    return (
        <div>
            <h1>Chào mừng đến với hệ thống quản lý thi!</h1>
        </div>
    );
};

export default Welcome;
