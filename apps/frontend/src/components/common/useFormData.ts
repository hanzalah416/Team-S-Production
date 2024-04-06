// useFormData.ts
import { useContext } from "react";
import {
  FormDataContext,
  FormDataContextType,
} from "../service_requests/FormDataContext.tsx";

export const useFormData = (): FormDataContextType => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error("useFormData must be used within a FormDataProvider");
  }
  return context;
};
