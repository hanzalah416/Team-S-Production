import { PrismaClient } from "../../../packages/database/.prisma/client";

import readCSVFile from "./Readcsv.js";

const prisma = new PrismaClient();

async function main() {
  const edges = readCSVFile("L1Edges.csv");
  const nodes = readCSVFile("L1Nodes.csv");

  await prisma.nodeEdge.deleteMany();
  await prisma.node.deleteMany();

  for (const node of nodes) {
    await prisma.node.create({
      data: {
        nodeID: node[0],
        xcoord: Number(node[1]),
        ycoord: Number(node[2]),
        floor: node[3],
        building: node[4],
        nodeType: node[5],
        longName: node[6],
        shortName: node[7],
      },
    });
  }
  console.log(`Data import complete for ${"Nodes"}`);

  for (const edge of edges) {
    await prisma.nodeEdge.create({
      data: {
        startNodeID: edge[0],
        endNodeID: edge[1],
      },
    });
  }
  console.log(`Data import complete for ${"Edges"}`);
}

export default main;

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
