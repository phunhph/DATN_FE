import React from 'react'
import './CustomRadio.scss'

interface CustomRadioProps {
    id: string;
    name: string;
    value: string;
    label: string;
    checked?: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    defaultChecked?:boolean;
    className? :string
}

const CustomRadio: React.FC<CustomRadioProps> = ({
    id,
    name,
    value,
    label,
    checked,
    onChange,
    defaultChecked,
    className
}) => {
    return (
        <div className="custom-radio">
            <input
                type="radio"
                id={id}
                name={name}
                value={value}
                className="custom-radio-input"
                checked={checked}
                onChange={onChange}
                defaultChecked={defaultChecked}
            />
            <label htmlFor={id} className={`custom-radio-label ${className}`}>
                {label}
            </label>
        </div>
    )
}

export default CustomRadio
