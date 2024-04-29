import stringSimilarity from "string-similarity";

//Function to find the closest match in an array of strings
export default function findClosestMatch(input: string, options: string[]) {
  let bestMatch = "null";
  let bestScore = -Infinity;

  options.forEach((option) => {
    const similarityScore = stringSimilarity.compareTwoStrings(input, option);
    if (similarityScore > bestScore) {
      bestScore = similarityScore;
      bestMatch = option;
    }
  });

  return bestMatch;
}
