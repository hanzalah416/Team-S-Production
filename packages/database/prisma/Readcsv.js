import fs from "fs";
import path from "path";

function readCSVFile(fileName) {
  const __dirname = path.resolve(path.dirname(""));
  const filePath = path.join(__dirname, fileName);
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return data
      .split("\r\n")
      .slice(1, -1) // Remove the first row and the last row
      .map((row) => row.split(","));
  } catch (err) {
    console.error(err);
    return [[]];
  }
}
export default readCSVFile;
