export function GetSecondWord(input: string): string {
  // Remove leading and trailing whitespace
  const trimmedInput = input.trim();

  // Split the string into words
  const words = trimmedInput.split(" ");

  // Check if there is at least a second word
  if (words.length > 1) {
    // Return the second word
    return words[1];
  } else {
    // Return undefined if there's no second word
    return "undefined";
  }
}
