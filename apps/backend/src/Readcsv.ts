import fs from "fs";
import path from "path";

function readCSVFile(fileName: string): string[][] {
  const filePath = path.join(__dirname, "..", "csv_folder", fileName);

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return data
      .split("\r\n")
      .slice(1, -1) // Remove the first row and the last row
      .map((row: string) => row.split(","));
  } catch (err) {
    console.error(err);
    return [[]];
  }
}
export default readCSVFile;
