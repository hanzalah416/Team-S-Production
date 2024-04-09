-- CreateEnum
CREATE TYPE "Authentication" AS ENUM ('user', 'staff', 'admin');

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
    "orderNumber" SERIAL NOT NULL,
    "patientName" TEXT NOT NULL,
    "PatientRoom" INTEGER NOT NULL,
    "customMessage" TEXT,

    CONSTRAINT "FlowerRequests_pkey" PRIMARY KEY ("orderNumber")
);

-- CreateTable
CREATE TABLE "StaffRequests" (
    "requestID" SERIAL NOT NULL,
    "priority" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "firstField" TEXT NOT NULL,
    "secondField" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "StaffRequests_pkey" PRIMARY KEY ("requestID")
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
    "startnode" TEXT NOT NULL,
    "endnode" TEXT NOT NULL,

    CONSTRAINT "NodeEdge_pkey" PRIMARY KEY ("startnode","endnode")
);

-- CreateIndex
CREATE UNIQUE INDEX "hospitalUser_userName_key" ON "hospitalUser"("userName");

-- AddForeignKey
ALTER TABLE "NodeEdge" ADD CONSTRAINT "NodeEdge_startnode_fkey" FOREIGN KEY ("startnode") REFERENCES "Node"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeEdge" ADD CONSTRAINT "NodeEdge_endnode_fkey" FOREIGN KEY ("endnode") REFERENCES "Node"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;
