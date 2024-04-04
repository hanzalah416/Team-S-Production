-- CreateTable
CREATE TABLE "HighScore" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "HighScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospitalUser" (
    "userID" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL,

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
    "startNodeID" TEXT NOT NULL,
    "endNodeID" TEXT NOT NULL,

    CONSTRAINT "NodeEdge_pkey" PRIMARY KEY ("startNodeID","endNodeID")
);

-- CreateIndex
CREATE UNIQUE INDEX "hospitalUser_userName_key" ON "hospitalUser"("userName");

-- AddForeignKey
ALTER TABLE "NodeEdge" ADD CONSTRAINT "NodeEdge_startNodeID_fkey" FOREIGN KEY ("startNodeID") REFERENCES "Node"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeEdge" ADD CONSTRAINT "NodeEdge_endNodeID_fkey" FOREIGN KEY ("endNodeID") REFERENCES "Node"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;
