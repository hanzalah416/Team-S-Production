import fs from "fs";

import path from "path";

function readCSVFile(fileName: string) {
  const filePath = path.join(__dirname, fileName);

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return data
      .split("\r\n")

      .slice(1, -1)
      .map((line) => line.replace("\r", ""))
      .map((line) => line.split(","));
  } catch (error) {
    console.error(error);
    return [];
  }
}
export default readCSVFile;
