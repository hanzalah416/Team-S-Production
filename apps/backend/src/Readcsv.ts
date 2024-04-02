import fs from "fs";

function readCSV(filePath: string): Array<Array<string>> {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return data
      .split("\r\n")
      .slice(1, -1)
      .map((line) => line.split(","));
  } catch (error) {
    console.error(error);
    return [];
  }
}
export default readCSV;
