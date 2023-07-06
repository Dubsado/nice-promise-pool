/**
 * Function to generate a random integer between two values
 * @param min - The minimum value for the random integer
 * @param max - The maximum value for the random integer
 * @returns - The generated random integer
 */
export function getRandomInt(min: number = 1, max: number = 1000): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum and minimum are inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
