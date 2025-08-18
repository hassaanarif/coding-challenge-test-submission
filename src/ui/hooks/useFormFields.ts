import { useCallback, useState } from "react";

interface FormFields {
  [key: string]: string;
}

interface UseFormFieldsReturn {
  formFields: FormFields;
  handleFieldChange: (fieldName: string, value: string) => void;
  clearAllFields: () => void;
  setFieldValue: (fieldName: string, value: string) => void;
}

const useFormFields = (initialFields: FormFields): UseFormFieldsReturn => {
  const [formFields, setFormFields] = useState<FormFields>(initialFields);

  const handleFieldChange = useCallback((fieldName: string, value: string) => {
    setFormFields((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  const clearAllFields = useCallback(() => {
    setFormFields(initialFields);
  }, [initialFields]);

  const setFieldValue = useCallback((fieldName: string, value: string) => {
    setFormFields((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  return {
    formFields,
    handleFieldChange,
    clearAllFields,
    setFieldValue,
  };
};

export default useFormFields;
