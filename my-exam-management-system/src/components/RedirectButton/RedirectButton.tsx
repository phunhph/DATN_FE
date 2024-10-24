import React from 'react';
import "./RedirectButton.scss"
import { Link } from 'react-router-dom';

type RedirectButtonProps = {
    to: string; 
    label: string; 
};

const RedirectButton: React.FC<RedirectButtonProps> = ({ to, label }) => {
    return (
        <Link to={to}>
            <button>{label}</button>
        </Link>
    );
};

export default RedirectButton;
