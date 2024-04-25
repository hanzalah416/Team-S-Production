export type GiftForm = {
  requestID: number;
  name: string;
  priority: string;
  location: string;
  requestType: string;
  status: string;
  GiftRequests: {
    orderNumber: number;
    typeGift: string;
    customMessage: string;
  };
};
