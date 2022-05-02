import React from "react";

const Button = ({ children, onClick, disabled }) => {
    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-xs p-1"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
