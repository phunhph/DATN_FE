import { useAuth } from '@/hooks';
import React from 'react';

const Home: React.FC = () => {
    useAuth();
    return (
        <div>
            <h1>Chào mừng đến với hệ thống quản lý thi!</h1>
        </div>
    );
};

export default Home;
