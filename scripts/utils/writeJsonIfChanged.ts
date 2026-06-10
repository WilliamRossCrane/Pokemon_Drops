import { readFileSync, writeFileSync, existsSync } from "fs";
import { logger } from "./logger.js";

export function writeJsonIfChanged(filePath: string, data: unknown): boolean {
  const newStr = JSON.stringify(data, null, 2) + "\n";

  if (existsSync(filePath)) {
    try {
      const cur = readFileSync(filePath, "utf-8");
      if (cur === newStr) {
        logger.info(`No changes detected for ${filePath}`);
        return false;
      }
    } catch (err) {
      logger.warn(`Failed to read existing ${filePath}: ${String(err)}`);
    }
  }

  writeFileSync(filePath, newStr, "utf-8");
  logger.success(`Wrote updated JSON to ${filePath}`);
  return true;
}
