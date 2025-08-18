import React from "react";
import $ from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = "" }) => {
  if (!message) return null;

  return <div className={`${$.error} ${className}`}>{message}</div>;
};

export default ErrorMessage;
