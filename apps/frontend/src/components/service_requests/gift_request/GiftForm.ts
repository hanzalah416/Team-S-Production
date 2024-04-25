export type GiftForm = {
    requestID: number;
    name: string;
    priority: string;
    location: string;
    requestType: string;
    status: string;
    GiftRequest: {
        orderNumber: number;
        typeGift: string;
        customMessage: string;
    };
};
