export type FlowerRequestForm = {
  requestID: number;
  name: string;
  priority: string;
  location: string;
  requestType: string;
  status: string;
  FlowerRequests: {
    orderNumber: number;
    typeFlower: string;
    customMessage: string;
  };
};
