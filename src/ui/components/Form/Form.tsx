import React from "react";
import Button from "../Button/Button";

interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  legend: string;
  submitButtonText: string;
  submitButtonVariant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  legend,
  submitButtonText,
  submitButtonVariant = "primary",
  children,
  className = "",
}) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      <fieldset>
        <legend>{legend}</legend>
        {children}
        <Button type="submit" variant={submitButtonVariant}>
          {submitButtonText}
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;
