import { getRandomInt } from "./getRandomInt";

/**
 * Function to generate a Promise that resolves after a certain duration
 * @param time - The time in milliseconds after which the promise should resolve
 * @param fail - Whether the promise should fail or not
 * @returns - The generated Promise
 */
export function generatePromise(time: number = 1, fail: boolean = false): PromiseToProcess {
  return new Promise((resolve, reject) => {
    if (fail) {
      return setTimeout(reject, getRandomInt());
    }
    setTimeout(resolve, time);
  });
}
