export type TransportationForm = {
    requestID: number;
    name: string;
    priority: string;
    location: string;
    requestType: string;
    status: string;
    TransportRequest: {
        requestNumber: number;
        patientName: string;
        transportationType: string;
        startLocation: string;
        endLocation: string;
    };
};
