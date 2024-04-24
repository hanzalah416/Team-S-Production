export type SanitationForm = {
  requestID: number;
  name: string;
  priority: string;
  location: string;
  requestType: string;
  status: string;
  SanitationRequest: {
    orderNumber: number;
    sanitationType: string;
    permission: string;
  };
};
