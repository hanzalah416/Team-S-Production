import PrismaClient from "./bin/database-connection.ts";
import createCsvFile from "./WriteCSV";

async function CreateCSVFromDB() {
  const allNodes = await PrismaClient.node.findMany();
  const allEdges = await PrismaClient.nodeEdge.findMany();
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
      { id: "startNode", title: "startNode" },
      { id: "endNode", title: "endNode" },
    ],
    data: allEdges,
  };

  createCsvFile(nodeData, "csv_data/nodesFromDB.csv");
  createCsvFile(edgeData, "csv_data/edgesFromDB.csv");
}

CreateCSVFromDB()
  .then(async () => {
    await PrismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await PrismaClient.$disconnect();
    process.exit(1);
  });

export default CreateCSVFromDB;
