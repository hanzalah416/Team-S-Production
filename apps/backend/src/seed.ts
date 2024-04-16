import PrismaClient from "./bin/database-connection.ts";

import readCSVFile from "./Readcsv.ts";
import * as console from "console";
//import fs from "fs/promises";

async function seed() {
  const edges = readCSVFile("L1Edges.csv");
  const nodes = readCSVFile("L1Nodes.csv");
  const medicines = readCSVFile("medicine_data.csv");
  const dbNodeEdges = await PrismaClient.nodeEdge.findMany();
  const dbNodes = await PrismaClient.node.findMany();
  const medicineArray = await PrismaClient.medicine.findMany();
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
          edgeID: edge[0],
          startNode: edge[1],
          endNode: edge[2],
        },
      });
    }
    console.log("Edges populated");
  }

  if (medicineArray.length == 0) {
    for (const medicine of medicines) {
      await PrismaClient.medicine.create({
        data: {
          genericName: medicine[0],
          synName: medicine[1],
        },
      });
    }
    console.log("Medicines populated");
  } else {
    console.log("No medicine data to populate.");
  }
  // const convertToCSV = (data: Medicine[]) => {
  //   let csv = "Generic Name, Synonym Name\n";
  //   data.forEach((medicine) => {
  //     csv += `"${medicine.genericName}", "${medicine.synName}"\n`;
  //   });
  //   return csv;
  // };

  // const writeCSVToFile = async (csvData: string, filePath: string) => {
  //   try {
  //     await fs.writeFile(filePath, csvData);
  //     console.log(`CSV file saved successfully at ${filePath}`);
  //   } catch (error) {
  //     console.error("Error writing CSV file:", error);
  //   }
  // };
  // const csvData = convertToCSV(medicineData);
  // const filePath = "medicine_data.csv";
  // writeCSVToFile(csvData, filePath);
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

// interface Medicine {
//   genericName: string;
//   synName: string;
// }
export default seed;

// const medicineData = [
//   {
//     genericName: "zolpidem",
//     synName: "Ambien",
//   },
//   {
//     genericName: "Yaz (drospirenone and ethinyl estradiol)",
//     synName: "Yaz",
//   },
//   {
//     genericName: "viagra (sildenafil HCl)",
//     synName: "Viagra",
//   },
//   {
//     genericName: "verapamil SR",
//     synName: "Calan SR;Verelan PM",
//   },
//   {
//     genericName: "venlafaxine XR",
//     synName: "Effexor XR",
//   },
//   {
//     genericName: "valsartan",
//     synName: "Diovan",
//   },
//   {
//     genericName: "valaciclovir",
//     synName: "Valtrex",
//   },
//   {
//     genericName: "triamterene and hydrochlorothiazide",
//     synName: "Dyazide;Maxzide",
//   },
//   {
//     genericName: "triamcinolone Ace topical",
//     synName: "Aristocort;Cinalog;Kenalog;Triderm",
//   },
//   {
//     genericName: "trazodone HCl",
//     synName: "Desyrel",
//   },
//   {
//     genericName: "tramadol",
//     synName: "Ultram",
//   },
//   {
//     genericName: "topiramate",
//     synName: "Topamax",
//   },
//   {
//     genericName: "temezepam",
//     synName: "Restoril",
//   },
//   {
//     genericName: "tamsulosin",
//     synName: "Flomax",
//   },
//   {
//     genericName: "synthroid (levothyroxine sodium)",
//     synName: "Synthroid",
//   },
//   {
//     genericName: "sulfamethoxazole and trimethoprim DS",
//     synName: "Bactrim DS;Septra DS",
//   },
//   {
//     genericName: "spironolactone",
//     synName: "Aldactone",
//   },
//   {
//     genericName: "simvastatin",
//     synName: "Zocor",
//   },
//   {
//     genericName: "sertraline HCl",
//     synName: "Zoloft",
//   },
//   {
//     genericName: "rosuvastatin",
//     synName: "Crestor",
//   },
//   {
//     genericName: "ranitidine",
//     synName: "Zantac",
//   },
//   {
//     genericName: "quetiapine",
//     synName: "Seroquel",
//   },
//   {
//     genericName: "promethazine",
//     synName: "Phenergan",
//   },
//   {
//     genericName: "Premarin (conjugated estrogens)",
//     synName: "Premarin",
//   },
//   {
//     genericName: "pregabalin",
//     synName: "Lyrica",
//   },
//   {
//     genericName: "prednisone",
//     synName: "Deltasone",
//   },
//   {
//     genericName: "pravastatin",
//     synName: "Pravachol",
//   },
//   {
//     genericName: "potassium Chloride",
//     synName: "Klor-Con",
//   },
//   {
//     genericName: "pioglitazone",
//     synName: "Actos",
//   },
//   {
//     genericName: "paroxetine",
//     synName: "Paxil",
//   },
//   {
//     genericName: "pantoprazole",
//     synName: "Protonix",
//   },
//   {
//     genericName: "oxycodone and acetaminophen",
//     synName: "Percocet;Tylox;Roxicet;Endocet",
//   },
//   {
//     genericName: "omeprazole",
//     synName: "Prilosec",
//   },
//   {
//     genericName: "naproxen",
//     synName: "Naprosyn",
//   },
//   {
//     genericName: "montelukast",
//     synName: "Singulair",
//   },
//   {
//     genericName: "mometasone",
//     synName: "Nasonex",
//   },
//   {
//     genericName: "metoprolol tartrate",
//     synName: "Lopressor",
//   },
//   {
//     genericName: "metoprolol succinate XL",
//     synName: "Toprol",
//   },
//   {
//     genericName: "methylprednisone",
//     synName: "Medrol",
//   },
//   {
//     genericName: "metformin HCl",
//     synName: "Glucophage",
//   },
//   {
//     genericName: "meloxicam",
//     synName: "Mobic",
//   },
//   {
//     genericName: "lovastatin",
//     synName: "Mevacor",
//   },
//   {
//     genericName: "losartan",
//     synName: "Cozaar",
//   },
//   {
//     genericName: "lorazepam",
//     synName: "Ativan",
//   },
//   {
//     genericName: "lisinopril and hydrochlorothiazide",
//     synName: "Prinizide;Zestoretic",
//   },
//   {
//     genericName: "lisinopril",
//     synName: "Prinivil;Zestril",
//   },
//   {
//     genericName: "levothyroxine sodium",
//     synName: "Synthroid;Levoxl",
//   },
//   {
//     genericName: "levofloxacin",
//     synName: "Levaquin",
//   },
//   {
//     genericName: "lantus (insulin glargine)",
//     synName: "Lantus",
//   },
//   {
//     genericName: "lansoprazole",
//     synName: "Prevacid",
//   },
//   {
//     genericName: "isosorbide mononitrate",
//     synName: "Imdur",
//   },
//   {
//     genericName: "ibuprophen",
//     synName: "Motrin",
//   },
//   {
//     genericName: "hydrocodone and acetaminophen",
//     synName: "Lortab;Lorcet;Norco;Vicodin",
//   },
//   {
//     genericName: "hydrochlorothiazide",
//     synName: "Microzide",
//   },
//   {
//     genericName: "glyburide",
//     synName: "Diabeta",
//   },
//   {
//     genericName: "glipizide",
//     synName: "Glucotrol",
//   },
//   {
//     genericName: "glimepiride",
//     synName: "Amaryl",
//   },
//   {
//     genericName: "gabapentin",
//     synName: "Neurontin",
//   },
//   {
//     genericName: "furosemide",
//     synName: "Lasix",
//   },
//   {
//     genericName: "folic acid",
//     synName: "Folic Acid",
//   },
//   {
//     genericName: "fluticasone nasal spray",
//     synName: "Flonase",
//   },
//   {
//     genericName: "fluticasone and salmeterol inhaler",
//     synName: "Advair",
//   },
//   {
//     genericName: "fluoxetine HCl",
//     synName: "Prozac",
//   },
//   {
//     genericName: "fluconozole",
//     synName: "Diflucan",
//   },
//   {
//     genericName: "fexofenadine",
//     synName: "Allegra",
//   },
//   {
//     genericName: "fenofibrate",
//     synName: "Tricor",
//   },
//   {
//     genericName: "ezetimibe",
//     synName: "Zetia",
//   },
//   {
//     genericName: "esomeprazole",
//     synName: "Nexium",
//   },
//   {
//     genericName: "escitalopram",
//     synName: "Lexapro",
//   },
//   {
//     genericName: "enalapril",
//     synName: "Vasotec",
//   },
//   {
//     genericName: "Duloxetine",
//     synName: "Cymbalta",
//   },
//   {
//     genericName: "doxycycline hyclate",
//     synName: "Vibramycin",
//   },
//   {
//     genericName: "diclofenac sodium",
//     synName: "Voltaren",
//   },
//   {
//     genericName: "diazepam",
//     synName: "Valium",
//   },
//   {
//     genericName: "cyclobenzaprine",
//     synName: "Flexeril",
//   },
// ];
