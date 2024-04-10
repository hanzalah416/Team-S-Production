-- DropForeignKey
ALTER TABLE "NodeEdge" DROP CONSTRAINT "NodeEdge_endNodeID_fkey";

-- DropForeignKey
ALTER TABLE "NodeEdge" DROP CONSTRAINT "NodeEdge_startNodeID_fkey";

-- AddForeignKey
ALTER TABLE "NodeEdge" ADD CONSTRAINT "NodeEdge_startNode_fkey" FOREIGN KEY ("startNode") REFERENCES "Node"("nodeID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeEdge" ADD CONSTRAINT "NodeEdge_endNode_fkey" FOREIGN KEY ("endNode") REFERENCES "Node"("nodeID") ON DELETE CASCADE ON UPDATE CASCADE;
