import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import path from "path";

interface CsvData {
  headers: { id: string; title: string }[];
  data: any[];
}

function createCsvFile(data: CsvData, fileName: string) {
  const pathName = path.join(__dirname, "..", "csv_folder", fileName);
  const csvWriter = createCsvWriter({
    path: pathName,
    header: data.headers,
  });

  csvWriter.writeRecords(data.data);
  console.log(`CSV file written to ${path}`);
}
export default createCsvFile;
