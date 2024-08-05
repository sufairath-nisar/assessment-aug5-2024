import React from 'react';

const Button = ({ text,  onClick,  className }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md text-white  bg-slate-800 hover:bg-opacity-75 ${className}`}
      onClick={onClick}  
    >
      {text}
    </button>
  );
};

export default Button;