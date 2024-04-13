-- CreateTable
CREATE TABLE "MedicineRequests" (
    "medicineNumber" INTEGER NOT NULL,
    "typeMedicine" TEXT NOT NULL,
    "nameMedicine" TEXT NOT NULL,

    CONSTRAINT "MedicineRequests_pkey" PRIMARY KEY ("medicineNumber")
);

-- AddForeignKey
ALTER TABLE "MedicineRequests" ADD CONSTRAINT "MedicineRequests_medicineNumber_fkey" FOREIGN KEY ("medicineNumber") REFERENCES "ServiceRequest"("requestID") ON DELETE RESTRICT ON UPDATE CASCADE;
