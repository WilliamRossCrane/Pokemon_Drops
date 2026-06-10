// Simple colour-aware logger for the data update scripts.
// Each message includes a timestamp so GitHub Actions logs are easier to read.

const ts = () => new Date().toISOString();

export const logger = {
  info: (msg: string, ...args: unknown[]) =>
    console.log(`\x1b[36m[INFO]\x1b[0m  ${ts()} ${msg}`, ...args),

  success: (msg: string, ...args: unknown[]) =>
    console.log(`\x1b[32m[OK]\x1b[0m    ${ts()} ${msg}`, ...args),

  warn: (msg: string, ...args: unknown[]) =>
    console.warn(`\x1b[33m[WARN]\x1b[0m  ${ts()} ${msg}`, ...args),

  error: (msg: string, ...args: unknown[]) =>
    console.error(`\x1b[31m[ERROR]\x1b[0m ${ts()} ${msg}`, ...args),

  skip: (source: string, reason: string) =>
    console.log(`\x1b[90m[SKIP]\x1b[0m  ${ts()} ${source}: ${reason}`),
};
