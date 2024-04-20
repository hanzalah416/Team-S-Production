-- CreateEnum
CREATE TYPE "Authentication" AS ENUM ('user', 'staff', 'admin');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('unassigned', 'assigned', 'in_progress', 'closed');

-- CreateTable
CREATE TABLE "hospitalUser" (
    "userID" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL,
    "authType" "Authentication" NOT NULL DEFAULT 'user',

    CONSTRAINT "hospitalUser_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "FlowerRequests" (
    "orderNumber" INTEGER NOT NULL,
    "typeFlower" TEXT NOT NULL,
    "customMessage" TEXT NOT NULL,

    CONSTRAINT "FlowerRequests_pkey" PRIMARY KEY ("orderNumber")
);

-- CreateTable
CREATE TABLE "MedicineRequests" (
    "medicineNumber" INTEGER NOT NULL,
    "typeMedicine" TEXT NOT NULL,
    "nameMedicine" TEXT NOT NULL,

    CONSTRAINT "MedicineRequests_pkey" PRIMARY KEY ("medicineNumber")
);

-- CreateTable
CREATE TABLE "SecurityRequest" (
    "orderNumberSec" INTEGER NOT NULL,
    "securityType" TEXT NOT NULL,
    "threatType" TEXT NOT NULL,

    CONSTRAINT "SecurityRequest_pkey" PRIMARY KEY ("orderNumberSec")
);

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

-- CreateTable
CREATE TABLE "Node" (
    "nodeID" TEXT NOT NULL,
    "xcoord" INTEGER NOT NULL,
    "ycoord" INTEGER NOT NULL,
    "floor" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL,
    "longName" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("nodeID")
);

-- CreateTable
CREATE TABLE "NodeEdge" (
    "edgeID" TEXT NOT NULL,
    "startNode" TEXT NOT NULL,
    "endNode" TEXT NOT NULL,

    CONSTRAINT "NodeEdge_pkey" PRIMARY KEY ("edgeID")
);

-- CreateIndex
CREATE UNIQUE INDEX "hospitalUser_userName_key" ON "hospitalUser"("userName");

-- AddForeignKey
ALTER TABLE "FlowerRequests" ADD CONSTRAINT "FlowerRequests_orderNumber_fkey" FOREIGN KEY ("orderNumber") REFERENCES "ServiceRequest"("requestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineRequests" ADD CONSTRAINT "MedicineRequests_medicineNumber_fkey" FOREIGN KEY ("medicineNumber") REFERENCES "ServiceRequest"("requestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityRequest" ADD CONSTRAINT "SecurityRequest_orderNumberSec_fkey" FOREIGN KEY ("orderNumberSec") REFERENCES "ServiceRequest"("requestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SanitationRequest" ADD CONSTRAINT "SanitationRequest_orderNumber_fkey" FOREIGN KEY ("orderNumber") REFERENCES "ServiceRequest"("requestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeEdge" ADD CONSTRAINT "NodeEdge_startNode_fkey" FOREIGN KEY ("startNode") REFERENCES "Node"("nodeID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeEdge" ADD CONSTRAINT "NodeEdge_endNode_fkey" FOREIGN KEY ("endNode") REFERENCES "Node"("nodeID") ON DELETE CASCADE ON UPDATE CASCADE;
