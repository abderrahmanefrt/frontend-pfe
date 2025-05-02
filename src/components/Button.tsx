import React from "react";

interface ButtonProps {
  children: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,                 // Disables the button when true
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${disabled ? "disabled" : ""}`}
    >
      {children}
    </button>
  );
};

export default Button;

