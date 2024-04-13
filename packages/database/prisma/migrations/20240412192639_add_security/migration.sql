-- CreateTable
CREATE TABLE "SecurityRequest" (
    "orderNumberSec" INTEGER NOT NULL,
    "securityType" TEXT NOT NULL,
    "threatType" TEXT NOT NULL,

    CONSTRAINT "SecurityRequest_pkey" PRIMARY KEY ("orderNumberSec")
);

-- AddForeignKey
ALTER TABLE "SecurityRequest" ADD CONSTRAINT "SecurityRequest_orderNumberSec_fkey" FOREIGN KEY ("orderNumberSec") REFERENCES "ServiceRequest"("requestID") ON DELETE RESTRICT ON UPDATE CASCADE;
