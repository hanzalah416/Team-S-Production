import { Node } from "../common/NodeInterface.ts";
import { Position } from "../common/PositionInterface.ts";
import { useEffect, useState } from "react";
import stringSimilarity from "string-similarity";
import SpeechKey from "./SpeechKey.ts";

export default function SpeechToText(props: {
  handleSelection: (value: Position | null, type: "start" | "end") => void;
  getPositionById: (id: string) => Position;
  startPosition: Position | null;
}) {
  const [locations, setLocations] = useState<Position[]>([]);
  const sortedLocations = [...locations]
    .filter((location) => !location.label.includes("Hall")) // Change startsWith to includes
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((location) => location.label);

  useEffect(() => {
    fetch("/api/nodes")
      .then((response) => response.json())
      .then((nodes: Node[]) => {
        const formattedLocations: Position[] = nodes.map((node) => ({
          label: node.longName || "Unknown",
          id: node.id,
          top: `${node.ycoord}px`,
          left: `${node.xcoord}px`,
          floor: node.floor,
        }));
        setLocations(formattedLocations);
      })
      .catch((error) => console.error("Failed to fetch node data:", error));
  }, []);

  const grammar =
    "#JSGF V1.0; grammar locations; public <location> = " +
    sortedLocations.join(" | ") +
    " ;";
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;
  const recognition = new SpeechRecognition();
  const speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  function handleClick() {
    recognition.start();
    console.log("Ready to receive Color");
  }

  recognition.onresult = (event) => {
    const spokenLocationRaw = event.results[0][0].transcript;
    console.log(spokenLocationRaw);
    //console.log(sortedLocations);

    if (isFirstWordClosest(spokenLocationRaw)) {
      const keyTypes = [
        "atm",
        "busstop",
        "cafe",
        "elevator",
        "emergency",
        "entrance",
        "escalator",
        "handicapped",
        "parking",
        "restroom",
        "valet",
        "vending",
        "waitingroom",
      ];

      const locationType = findClosestMatch(
        getSecondWord(spokenLocationRaw),
        keyTypes,
      );

      if (props.startPosition) {
        SpeechKey(
          props.startPosition?.id,
          props.handleSelection,
          props.getPositionById,
          locationType,
        );
      }
    } else if (!props.startPosition) {
      const spokenLocation = findClosestMatch(
        spokenLocationRaw,
        sortedLocations,
      );
      props.handleSelection(findLocationByLongName(spokenLocation), "start");
    } else {
      const spokenLocation = findClosestMatch(
        spokenLocationRaw,
        sortedLocations,
      );
      props.handleSelection(findLocationByLongName(spokenLocation), "end");
    }
  };

  function isFirstWordClosest(input: string): boolean {
    // Remove leading and trailing whitespace
    const trimmedInput = input.trim();

    // Split the string into words
    const words = trimmedInput.split(" ");

    // Get the first word (if any words exist)
    const firstWord = words.length > 0 ? words[0] : "";

    // Check if the first word is "closest" (case-sensitive)
    return firstWord === "closest";
  }
  function getSecondWord(input: string): string {
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

  const findClosestMatch = (input: string, options: string[]): string => {
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
  };

  const findLocationByLongName = (longNameToFind: string): Position | null => {
    const foundLocation = locations.find(
      (location) =>
        location.label.toLowerCase() === longNameToFind.toLowerCase(),
    );
    return foundLocation !== undefined ? foundLocation : null;
  };

  return (
    <div>
      <button onClick={handleClick}>Start</button>
    </div>
  );
}
