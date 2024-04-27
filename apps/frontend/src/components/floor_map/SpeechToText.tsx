import { Node } from "../common/NodeInterface.ts";
import { Position } from "../common/PositionInterface.ts";
import { useEffect, useState } from "react";
import stringSimilarity from "string-similarity";

export default function SpeechToText(props: {
  handleSelection: (value: Position | null, type: "start" | "end") => void;
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

  /*
    document.body.onclick = () => {
        recognition.start();
        console.log("Ready to receive a color command.");
    };

     */
  function handleClick() {
    recognition.start();
    console.log("Ready to receive Color");
  }

  recognition.onresult = (event) => {
    const spokenLocationRaw = event.results[0][0].transcript;
    console.log(spokenLocationRaw);
    //console.log(sortedLocations);

    const spokenLocation = findClosestMatch(spokenLocationRaw, sortedLocations);

    if (!props.startPosition) {
      props.handleSelection(findLocationByLongName(spokenLocation), "start");
    } else {
      props.handleSelection(findLocationByLongName(spokenLocation), "end");
    }
  };

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
