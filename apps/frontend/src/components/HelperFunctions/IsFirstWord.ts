//Function to check if a strings first word is matches anything in an inputed string array
export default function isFirstWord(input: string, matches: string[]): boolean {
  // Remove leading and trailing whitespace
  const trimmedInput = input.trim();

  // Split the string into words
  const words = trimmedInput.split(" ");

  // Get the first word (if any words exist)
  const firstWord = words.length > 0 ? words[0] : "";

  //Check if the first word is closest or nearest
  if (matches.includes(firstWord)) {
    return true;
  }

  return false;
}
