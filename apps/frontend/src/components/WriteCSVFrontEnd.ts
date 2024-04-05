import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import { Node } from "../../../../packages/database/.prisma/client";

export interface CsvData {
  headers: { id: string; title: string }[];
  data: Node[];
}

async function createCsvFile(data: CsvData, path: string) {
  const csvWriter = createCsvWriter({
    path: path,
    header: data.headers,
  });

  try {
    await csvWriter.writeRecords(data.data);
    console.log(`CSV file written to ${path}`);
  } catch (error) {
    console.error("Error writing CSV:", error);
  }
}
export default createCsvFile;
