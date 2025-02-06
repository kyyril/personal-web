import path from "path";
import fs from "fs/promises"; // Use promises version of fs
import { Data } from "./interfaces/data";

export async function getJSONData(): Promise<Data> {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const file = await fs.readFile(filePath, "utf-8"); // Use await for async read

  return JSON.parse(file);
}

export async function getJSONProject(): Promise<Data> {
  const filePath = path.join(process.cwd(), "public", "project.json");
  const file = await fs.readFile(filePath, "utf-8"); // Use await for async read

  return JSON.parse(file);
}
