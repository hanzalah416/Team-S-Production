-- CreateTable
CREATE TABLE "GiftRequests" (
    "orderNumber" INTEGER NOT NULL,
    "typeGift" TEXT NOT NULL,
    "customMessage" TEXT NOT NULL,

    CONSTRAINT "GiftRequests_pkey" PRIMARY KEY ("orderNumber")
);

-- CreateTable
CREATE TABLE "Employees" (
    "employeeID" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("employeeID")
);

-- CreateTable
CREATE TABLE "LanguageRequest" (
    "orderNumber" INTEGER NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "LanguageRequest_pkey" PRIMARY KEY ("orderNumber")
);

-- CreateTable
CREATE TABLE "RoomScheduling" (
    "requestNumber" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "RoomScheduling_pkey" PRIMARY KEY ("requestNumber")
);

-- CreateTable
CREATE TABLE "TransportRequest" (
    "requestNumber" INTEGER NOT NULL,
    "patientName" TEXT NOT NULL,
    "transportationType" TEXT NOT NULL,
    "startLocation" TEXT NOT NULL,
    "endLocation" TEXT NOT NULL,

    CONSTRAINT "TransportRequest_pkey" PRIMARY KEY ("requestNumber")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "medicineID" SERIAL NOT NULL,
    "genericName" TEXT NOT NULL,
    "synName" TEXT,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("medicineID")
);

-- AddForeignKey
ALTER TABLE "GiftRequests" ADD CONSTRAINT "GiftRequests_orderNumber_fkey" FOREIGN KEY ("orderNumber") REFERENCES "ServiceRequest"("requestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageRequest" ADD CONSTRAINT "LanguageRequest_orderNumber_fkey" FOREIGN KEY ("orderNumber") REFERENCES "ServiceRequest"("requestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomScheduling" ADD CONSTRAINT "RoomScheduling_requestNumber_fkey" FOREIGN KEY ("requestNumber") REFERENCES "ServiceRequest"("requestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportRequest" ADD CONSTRAINT "TransportRequest_requestNumber_fkey" FOREIGN KEY ("requestNumber") REFERENCES "ServiceRequest"("requestID") ON DELETE RESTRICT ON UPDATE CASCADE;
