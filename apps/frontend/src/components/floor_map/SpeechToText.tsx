import { Node } from "../common/NodeInterface.ts";
import { Position } from "../common/PositionInterface.ts";
import { useEffect, useState } from "react";
import FindClosestMatch from "../HelperFunctions/FindClosestMatch.ts";
import SpeechKey from "./SpeechKey.ts";
import isFirstWord from "../HelperFunctions/IsFirstWord.ts";
import { GetSecondWord } from "../HelperFunctions/GetSecondWord.ts";
import MicIcon from "@mui/icons-material/Mic";
import styles from "./FloorMap.module.css";

//Function to turn speech into text
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
    console.log("Ready to receive Location");
  }

  recognition.onresult = (event) => {
    const spokenLocationRaw = event.results[0][0].transcript;
    console.log(spokenLocationRaw);
    //console.log(sortedLocations);

    if (isFirstWord(spokenLocationRaw, ["closest", "nearest"])) {
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

      const locationType = FindClosestMatch(
        GetSecondWord(spokenLocationRaw),
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
      const spokenLocation = FindClosestMatch(
        spokenLocationRaw,
        sortedLocations,
      );

      props.handleSelection(FindLocationByLongName(spokenLocation), "start");
    } else {
      const spokenLocation = FindClosestMatch(
        spokenLocationRaw,
        sortedLocations,
      );

      props.handleSelection(FindLocationByLongName(spokenLocation), "end");
    }
  };

  //Find the location based on long name given
  const FindLocationByLongName = (longNameToFind: string): Position | null => {
    const foundLocation = locations.find(
      (location) =>
        location.label.toLowerCase() === longNameToFind.toLowerCase(),
    );
    return foundLocation !== undefined ? foundLocation : null;
  };

  return (
    <div>
      <button onClick={handleClick} className={styles.micButton}>
        <MicIcon />
      </button>
    </div>
  );
}
