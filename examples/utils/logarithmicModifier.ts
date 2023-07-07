/**
 * A function that mostly returns the highest value based on the input
 * but gives the chance to occassionally return close to the middle
 * then even less likely return close to zero.
 *
 * I'll be honest here, ChatGPT made this
 * src: https://chat.openai.com/share/47c964c9-eb80-4890-8b0a-159c723f961a
 * @param input
 * @returns
 */
export function logarithmicModifier(input: number): number {
  // Calculate 5% less than input
  const lessPercentage = input * 0.95;
  // Calculate close to zero (0.1% of input)
  const closeToZero = input * 0.001;

  // Generate a random number between 0 and 1
  const rand = Math.random();

  // 90% chance to return almost zero
  if (rand < 0.9) {
    return closeToZero;
  }
  // 9% chance to return 5% less than input
  else if (rand < 0.99) {
    return lessPercentage;
  }
  // 1% chance to return the actual input
  else {
    return input;
  }
}
