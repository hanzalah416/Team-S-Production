import PrismaClient from "./bin/database-connection.ts";

import readCSVFile from "./Readcsv.ts";

async function seed() {
  const edges = readCSVFile("L1Edges.csv");
  const nodes = readCSVFile("L1Nodes.csv");
  const dbNodeEdges = await PrismaClient.nodeEdge.findMany();
  const dbNodes = await PrismaClient.node.findMany();
  if (dbNodes.length == 0) {
    for (const node of nodes) {
      await PrismaClient.node.upsert({
        where: { nodeID: node[0] },
        create: {
          nodeID: node[0],
          xcoord: Number(node[1]),
          ycoord: Number(node[2]),
          floor: node[3],
          building: node[4],
          nodeType: node[5],
          longName: node[6],
          shortName: node[7],
        },
        update: {},
      });
    }
    console.log("Nodes populated");
  }

  if (dbNodeEdges.length == 0) {
    for (const edge of edges) {
      await PrismaClient.nodeEdge.create({
        data: {
          startNode: edge[0],
          endNode: edge[1],
        },
      });
    }
    console.log("Edges populated");
  }

  const temp = await PrismaClient.hospitalUser.findMany({
    where: {
      userName: "admin",
    },
    select: {
      userName: true,
    },
  });
  if (temp.length == 0) {
    await PrismaClient.hospitalUser.create({
      data: {
        userName: "admin",
        userPassword: "admin",
        userEmail: "wwong2@wpi.edu",
        authType: "admin",
      },
    });
  }
}

export default seed;
