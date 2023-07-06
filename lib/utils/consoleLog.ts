export const LOG_LEVEL = process.env.LOG_LEVEL || "info";

/**
 * Function to conditionally send console logs based on the environment log level
 * @param log - The log string to print
 */
export function consoleLog(log: string) {
  if (LOG_LEVEL == "verbose") {
    console.log(log);
  }
}
