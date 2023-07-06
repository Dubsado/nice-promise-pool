/**
 * Function to generate a random ID of specified length
 * @param length - The length of the ID to generate
 * @returns The generated ID
 */
export function generateRandomString(length: number): string {
  if (length < 3) {
    length = 3;
  }

  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
