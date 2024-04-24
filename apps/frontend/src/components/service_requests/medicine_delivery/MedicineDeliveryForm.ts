export type MedicineDeliveryForm = {
  requestID: number;
  name: string;
  priority: string;
  location: string;
  requestType: string;
  status: string;
  MedicineRequests: {
    MedicineNumber: number;
    typeMedicine: string;
    nameMedicine: string;
  };
};
