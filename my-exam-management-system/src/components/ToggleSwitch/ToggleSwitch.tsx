import './ToggleSwitch.scss'
interface ToggleSwitchProps {
    id: string;
    toggleState: boolean;
    onToggle: (id: string) => void;
    className?: string;
}

export const ToggleSwitch = ({ id, toggleState, onToggle, className }: ToggleSwitchProps) => (
    // <div
    //     className={`toggle-switch ${className} ${toggleState == true ? "active_" : "inactive"}`}
    //     onClick={() => onToggle(id)}
    // >
    //     <div className="toggle-switch-circle" />
    // </div>
    <label className={`switch ${className}`} 
        onClick={(e) => {
            e.stopPropagation()
            onToggle(id)
        }}>
        <input type="checkbox" className="switch-input" checked={toggleState}></input>
            <span className="slider round"></span>
    </label>
);

