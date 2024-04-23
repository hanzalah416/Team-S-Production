export type asLanguageRequestForm = {
  requestID: number;
  name: string;
  priority: string;
  location: string;
  requestType: string;
  status: string;
  LanguageRequest: {
    orderNumber: number;
    language: string;
  };
};
