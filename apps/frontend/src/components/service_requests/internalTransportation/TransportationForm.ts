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
    startLocation: string;
    endLocation: string;
    transportationType: string;
  };
};
