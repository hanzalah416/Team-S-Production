import { PrismaClient } from "../../../packages/database/.prisma/client";
import createCsvFile from "prisma/WriteCSV.ts";

const prisma = new PrismaClient();

async function main() {
  const allNodes = await prisma.node.findMany();
  const allEdges = await prisma.nodeEdge.findMany();
  console.log(allEdges);
  const nodeData = {
    headers: [
      { id: "nodeID", title: "nodeID" },
      { id: "xcoord", title: "xcoord" },
      { id: "ycoord", title: "ycoord" },
      { id: "floor", title: "floor" },
      { id: "building", title: "building" },
      { id: "nodeType", title: "nodeType" },
      { id: "longName", title: "longName" },
      { id: "shortName", title: "shortName" },
    ],
    data: allNodes,
  };

  const edgeData = {
    headers: [
      { id: "startNodeID", title: "startNodeID" },
      { id: "endNodeID", title: "endNodeID" },
    ],
    data: allEdges,
  };

  createCsvFile(nodeData, "csv_data/nodesFromDB.csv");
  createCsvFile(edgeData, "csv_data/edgesFromDB.csv");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
