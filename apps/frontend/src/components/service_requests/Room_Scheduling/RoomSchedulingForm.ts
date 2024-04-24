export type RoomSchedulingForm = {
    requestID: number;
    name: string;
    priority: string;
    location: string;
    requestType: string;
    status: string;
    RoomScheduling: {
        requestNumber: number;
        startTime: string;
        endTime: string;
    };
};
