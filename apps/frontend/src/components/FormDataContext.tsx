// FormDataContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

// Define the structure of your form data
interface OrderFlowersData {
    patientName: string;
    patientRoom: string;
    customMessage: string;
}

interface OrderPaymentData {
    cardNumber: string;
    cvv: string;
    expirationDate: string;
    nameOnCard: string;
}

interface FormData {
    orderFlowers: OrderFlowersData;
    orderPayment: OrderPaymentData;
}

// Export the context type
export interface FormDataContextType {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

// Create the context
export const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

// Create the provider component
export const FormDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<FormData>({
        orderFlowers: {
            patientName: '',
            patientRoom: '',
            customMessage: '',
        },
        orderPayment: {
            cardNumber: '',
            cvv: '',
            expirationDate: '',
            nameOnCard: '',
        },
    });

    return (
        <FormDataContext.Provider value={{ formData, setFormData }}>
            {children}
        </FormDataContext.Provider>
    );
};
