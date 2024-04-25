export type SecurityForm = {
  requestID: number;
  name: string;
  priority: string;
  location: string;
  requestType: string;
  status: string;
  SecurityRequests: {
    orderNumberSec: number;
    securityType: string;
    threatType: string;
  };
};
