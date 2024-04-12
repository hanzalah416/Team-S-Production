/*
  Warnings:

  - You are about to drop the column `PatientRoom` on the `FlowerRequests` table. All the data in the column will be lost.
  - You are about to drop the column `patientName` on the `FlowerRequests` table. All the data in the column will be lost.
  - You are about to drop the `StaffRequests` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `typeFlower` to the `FlowerRequests` table without a default value. This is not possible if the table is not empty.
  - Made the column `customMessage` on table `FlowerRequests` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('unassigned', 'assigned', 'in_progress', 'closed');

-- AlterTable
ALTER TABLE "FlowerRequests" DROP COLUMN "PatientRoom",
DROP COLUMN "patientName",
ADD COLUMN     "typeFlower" TEXT NOT NULL,
ALTER COLUMN "orderNumber" DROP DEFAULT,
ALTER COLUMN "customMessage" SET NOT NULL;
DROP SEQUENCE "FlowerRequests_orderNumber_seq";

-- DropTable
DROP TABLE "StaffRequests";

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "requestID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'unassigned',

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("requestID")
);

-- CreateTable
CREATE TABLE "SanitationRequest" (
    "orderNumber" INTEGER NOT NULL,
    "sanitationType" TEXT NOT NULL,
    "permission" TEXT NOT NULL,

    CONSTRAINT "SanitationRequest_pkey" PRIMARY KEY ("orderNumber")
);

-- AddForeignKey
ALTER TABLE "FlowerRequests" ADD CONSTRAINT "FlowerRequests_orderNumber_fkey" FOREIGN KEY ("orderNumber") REFERENCES "ServiceRequest"("requestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SanitationRequest" ADD CONSTRAINT "SanitationRequest_orderNumber_fkey" FOREIGN KEY ("orderNumber") REFERENCES "ServiceRequest"("requestID") ON DELETE RESTRICT ON UPDATE CASCADE;
