import fs from "fs";
import path from "path";

export function logChat(userId, sender, text) {
  const now = new Date().toLocaleString();
  const logLine = `[${now}] ${sender.toUpperCase()}: ${text}\n`;

  const logsDir = path.join(process.cwd(), "chatlogs");
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

  const filePath = path.join(logsDir, `${userId}.txt`);
  fs.appendFileSync(filePath, logLine, "utf8");
}
