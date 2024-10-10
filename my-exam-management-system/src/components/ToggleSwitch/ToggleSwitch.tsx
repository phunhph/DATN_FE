import React from 'react';
import './ToggleSwitch.scss'
interface ToggleSwitchProps {
    id: string;
    toggleState: string;
    onToggle: (id: string) => void; 
}

export const ToggleSwitch = ({ id, toggleState, onToggle }: ToggleSwitchProps) => (
    <div
        className={`toggle-switch ${toggleState =='true' ? "active_" : "inactive"}`}
        onClick={() => onToggle(id)}
    >
        <div className="toggle-switch-circle" />
    </div>
);

