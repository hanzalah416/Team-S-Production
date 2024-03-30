// DisplayFormData.tsx
import React from 'react';
import { useFormData } from './useFormData';

const DisplayFormData: React.FC = () => {
    const { formData } = useFormData();

    return (
        <div>

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <h2>Order Flowers Data:</h2>
            <pre>{JSON.stringify(formData.orderFlowers, null, 2)}</pre>

            <h2>Order Payment Data:</h2>
            <pre>{JSON.stringify(formData.orderPayment, null, 2)}</pre>

        </div>
    );
};

export default DisplayFormData;
