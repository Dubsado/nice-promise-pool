import { generatePromise } from "../../lib/utils/generatePromise";
import { logarithmicModifier } from "./logarithmicModifier";

/**
 * Return a number of promises to resolve by our example applications.
 * @param limit It will sometimes return less than this limit to show that the batch process
 * can process less items depending on what is coming from the database/api
 * @returns This is going to return a number of promises per the available amount of slots
 */
export function queryEventDatabase(limit: number) {
  const results = [];
  for (let i = 0; i < limit; i++) {
    results.push(generatePromise());
  }
  const numberToRemove = logarithmicModifier(limit);
  // this will remove items from the end of the array
  // explained here: https://chat.openai.com/share/50dea80f-6348-47e3-8fef-52a154498705
  return results.splice(-numberToRemove, numberToRemove);
}
