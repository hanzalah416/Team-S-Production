import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import { NodeRow } from "./NodeDataPage.tsx";

interface CsvData {
  headers: { id: string; title: string }[];
  data: NodeRow[];
}

function createCsvFile(data: CsvData, path: string) {
  const csvWriter = createCsvWriter({
    path: path,
    header: data.headers,
  });

  csvWriter.writeRecords(data.data);
  console.log(`CSV file written to ${path}`);
}
export default createCsvFile;
