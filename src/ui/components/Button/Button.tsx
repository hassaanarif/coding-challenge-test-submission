import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  className = "",
}) => {
  const buttonClasses = [$.button, variant === "primary" ? $.primary : $.secondary, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClasses} type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
